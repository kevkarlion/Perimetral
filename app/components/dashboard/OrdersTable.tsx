"use client";

import { useEffect, useState, useMemo } from "react";
import React from "react";
import { IOrder } from "@/types/orderTypes";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ChevronDown,
  ChevronUp,
  Clipboard,
  ClipboardCheck,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function OrdersTable() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [copiedFields, setCopiedFields] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("Error al cargar las órdenes");
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filtrar órdenes por orderNumber - con manejo seguro
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    
    return orders.filter(order => {
      // Manejar casos donde orderNumber podría ser undefined o null
      const orderNumber = order.orderNumber || "";
      return orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [orders, searchTerm]);

  // Calcular órdenes para la página actual
  const currentOrders = useMemo(() => {
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    return filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  }, [currentPage, filteredOrders]);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Cambiar página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Ir a la página siguiente
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Ir a la página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const copyToClipboard = async (text: string, field: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFields({ [field]: true });
      setTimeout(
        () => setCopiedFields((prev) => ({ ...prev, [field]: false })),
        2000
      );
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Si hay muchas páginas, mostrar un rango alrededor de la página actual
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="CurrentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col" style={{ minHeight: '800px' }}>
      {/* Barra de búsqueda */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por número de orden (ORD-XXXXX-XX)..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Resetear a la primera página al buscar
            }}
            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand focus:border-brand sm:text-sm"
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                onClick={() => setSearchTerm("")}
                className="h-5 w-5 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-500">
            {filteredOrders.length} orden(es) encontrada(s)
          </p>
        )}
      </div>

      {/* Información de paginación */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Mostrando{" "}
          <span className="font-medium">
            {Math.min((currentPage - 1) * ordersPerPage + 1, filteredOrders.length)}
          </span>{" "}
          a{" "}
          <span className="font-medium">
            {Math.min(currentPage * ordersPerPage, filteredOrders.length)}
          </span>{" "}
          de <span className="font-medium">{filteredOrders.length}</span> órdenes
        </p>
        
        {/* Selector de página para móviles */}
        <div className="md:hidden">
          <select
            value={currentPage}
            onChange={(e) => setCurrentPage(Number(e.target.value))}
            className="block w-full py-1 pl-2 pr-8 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand focus:border-brand text-sm"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <option key={page} value={page}>
                Página {page}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contenedor de tabla con altura fija */}
      <div className="flex-grow">
        {/* Versión Desktop (md y superior) */}
        <div className="hidden md:block h-full">
          <div className="h-full flex flex-col">
            <div className="flex-grow overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      N° Orden
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cant. Productos
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <span>{order.orderNumber || "N/A"}</span>
                            {order.orderNumber && (
                              <button
                                onClick={() => copyToClipboard(order.orderNumber || "", `orderNumber-${order._id}`)}
                                className="ml-1 text-gray-400 hover:text-brand"
                                aria-label="Copiar número de orden"
                              >
                                {copiedFields[`orderNumber-${order._id}`] ? (
                                  <ClipboardCheck className="h-4 w-4" />
                                ) : (
                                  <Clipboard className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customer.email}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center gap-1">
                            {order.customer.phone || "Sin teléfono"}
                            {order.customer.phone && (
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    order.customer.phone || "",
                                    `phone-${order._id}`
                                  )
                                }
                                className="text-gray-400 hover:text-brand"
                                aria-label="Copiar teléfono"
                              >
                                {copiedFields[`phone-${order._id}`] ? (
                                  <ClipboardCheck className="h-4 w-4" />
                                ) : (
                                  <Clipboard className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.items.length}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${order.total.toLocaleString("es-AR")}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status === "completed"
                              ? "Completado"
                              : order.status === "cancelled"
                              ? "Cancelado"
                              : "Pendiente"}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(order.createdAt), "dd MMM yyyy", {
                            locale: es,
                          })}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => toggleExpand(order._id)}
                            className="text-brand hover:text-brand-dark flex items-center"
                            aria-label={
                              expandedOrder === order._id
                                ? "Contraer detalles"
                                : "Expandir detalles"
                            }
                          >
                            {expandedOrder === order._id ? (
                              <>
                                <ChevronUp className="h-5 w-5" />
                                <span className="ml-1">Ocultar</span>
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-5 w-5" />
                                <span className="ml-1">Ver</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedOrder === order._id && (
                        <tr className="bg-gray-50">
                          <td colSpan={8} className="px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">
                                  Información del Cliente
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-500 w-24">
                                      Nombre:
                                    </span>
                                    <span className="text-sm font-medium">
                                      {order.customer.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-500 w-24">
                                      Email:
                                    </span>
                                    <span className="text-sm font-medium flex items-center gap-1">
                                      {order.customer.email}
                                      <button
                                        onClick={() =>
                                          copyToClipboard(
                                            order.customer.email,
                                            `email-${order._id}`
                                          )
                                        }
                                        className="text-gray-400 hover:text-brand"
                                      >
                                        {copiedFields[`email-${order._id}`] ? (
                                          <ClipboardCheck className="h-4 w-4" />
                                        ) : (
                                          <Clipboard className="h-4 w-4" />
                                        )}
                                      </button>
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-500 w-24">
                                      Teléfono:
                                    </span>
                                    <span className="text-sm font-medium flex items-center gap-1">
                                      {order.customer.phone || "No proporcionado"}
                                      {order.customer.phone && (
                                        <button
                                          onClick={() =>
                                            copyToClipboard(
                                              order.customer.phone || "",
                                              `phone-${order._id}`
                                            )
                                          }
                                          className="text-gray-400 hover:text-brand"
                                        >
                                          {copiedFields[`phone-${order._id}`] ? (
                                            <ClipboardCheck className="h-4 w-4" />
                                          ) : (
                                            <Clipboard className="h-4 w-4" />
                                          )}
                                        </button>
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex items-start">
                                    <span className="text-sm text-gray-500 w-24">
                                      Dirección:
                                    </span>
                                    <span className="text-sm font-medium flex items-center gap-1">
                                      {order.customer.address || "No proporcionada"}
                                      {order.customer.address && (
                                        <button
                                          onClick={() =>
                                            copyToClipboard(
                                              order.customer.address || "",
                                              `address-${order._id}`
                                            )
                                          }
                                          className="text-gray-400 hover:text-brand"
                                        >
                                          {copiedFields[`address-${order._id}`] ? (
                                            <ClipboardCheck className="h-4 w-4" />
                                          ) : (
                                            <Clipboard className="h-4 w-4" />
                                          )}
                                        </button>
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">
                                  Detalles del Pedido
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex">
                                    <span className="text-sm text-gray-500 w-24">
                                      N° Orden:
                                    </span>
                                    <span className="text-sm font-medium flex items-center gap-1">
                                      {order.orderNumber || "N/A"}
                                      {order.orderNumber && (
                                        <button
                                          onClick={() =>
                                            copyToClipboard(order.orderNumber || "", `full-orderNumber-${order._id}`)
                                          }
                                          className="text-gray-400 hover:text-brand"
                                        >
                                          {copiedFields[`full-orderNumber-${order._id}`] ? (
                                            <ClipboardCheck className="h-4 w-4" />
                                          ) : (
                                            <Clipboard className="h-4 w-4" />
                                          )}
                                        </button>
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-sm text-gray-500 w-24">
                                      Método de pago:
                                    </span>
                                    <span className="text-sm font-medium capitalize">
                                      {order.paymentMethod}
                                    </span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-sm text-gray-500 w-24">
                                      Fecha:
                                    </span>
                                    <span className="text-sm font-medium">
                                      {format(new Date(order.createdAt), "PPPp", {
                                        locale: es,
                                      })}
                                    </span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-sm text-gray-500 w-24">
                                      Actualizado:
                                    </span>
                                    <span className="text-sm font-medium">
                                      {format(new Date(order.updatedAt), "PPPp", {
                                        locale: es,
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Lista de productos */}
                            <div className="mt-6">
                              <h4 className="text-sm font-medium text-gray-900 mb-3">
                                Productos ({order.items.length})
                              </h4>
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-50">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Producto
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cantidad
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Precio Unitario
                                      </th>
                                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Subtotal
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {order.items.map((item, index) => (
                                      <tr key={index}>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                          {item.name}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                          {item.quantity}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                          ${item.price.toLocaleString("es-AR")}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                          ${(item.price * item.quantity).toLocaleString("es-AR")}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  
                  {/* Filas vacías para mantener el tamaño constante */}
                  {currentOrders.length < ordersPerPage && 
                    Array.from({ length: ordersPerPage - currentOrders.length }).map((_, index) => (
                      <tr key={`empty-${index}`} className="h-16">
                        <td colSpan={8} className="px-4 py-4"></td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  {searchTerm ? "No se encontraron órdenes" : "No hay órdenes para mostrar"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Versión Mobile (sm y inferior) */}
        <div className="md:hidden space-y-4 p-4">
          {currentOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow p-4 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {order.customer.name}
                  </h3>
                  <p className="text-xs text-gray-500">{order.customer.email}</p>
                </div>
                <span
                  className={`px-2 text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status === "completed"
                    ? "Completado"
                    : order.status === "cancelled"
                    ? "Cancelado"
                    : "Pendiente"}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">N° Orden</p>
                  <p className="font-medium">{order.orderNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-medium">
                    ${order.total.toLocaleString("es-AR")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Productos</p>
                  <p className="font-medium">
                    {order.items.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha</p>
                  <p className="font-medium">
                    {format(new Date(order.createdAt), "dd MMM yy", {
                      locale: es,
                    })}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <p className="text-sm text-gray-900">
                    {order.customer.phone || "Sin teléfono"}
                  </p>
                  {order.customer.phone && (
                    <button
                      onClick={() =>
                        copyToClipboard(
                          order.customer.phone || "",
                          `phone-mobile-${order._id}`
                        )
                      }
                      className="text-gray-400 hover:text-brand"
                      aria-label="Copiar teléfono"
                    >
                      {copiedFields[`phone-mobile-${order._id}`] ? (
                        <ClipboardCheck className="h-4 w-4" />
                      ) : (
                        <Clipboard className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => toggleExpand(order._id)}
                  className="text-brand hover:text-brand-dark flex items-center gap-1 text-sm"
                  aria-label={
                    expandedOrder === order._id
                      ? "Contraer detalles"
                      : "Expandir detalles"
                  }
                >
                  {expandedOrder === order._id
                    ? "Menos detalles"
                    : "Más detalles"}
                  {expandedOrder === order._id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>

              {expandedOrder === order._id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Información del Cliente
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Nombre:</span>
                          <span className="font-medium">
                            {order.customer.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span className="font-medium flex items-center gap-1">
                            {order.customer.email}
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  order.customer.email,
                                  `email-mobile-${order._id}`
                                )
                              }
                              className="text-gray-400 hover:text-brand"
                              aria-label="Copiar email"
                            >
                              {copiedFields[`email-mobile-${order._id}`] ? (
                                <ClipboardCheck className="h-4 w-4" />
                              ) : (
                                <Clipboard className="h-4 w-4" />
                              )}
                            </button>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Teléfono:</span>
                          <span className="font-medium flex items-center gap-1">
                            {order.customer.phone || "No proporcionado"}
                            {order.customer.phone && (
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    order.customer.phone || "",
                                    `phone-detail-${order._id}`
                                  )
                                }
                                className="text-gray-400 hover:text-brand"
                                aria-label="Copiar teléfono"
                              >
                                {copiedFields[`phone-detail-${order._id}`] ? (
                                  <ClipboardCheck className="h-4 w-4" />
                                ) : (
                                  <Clipboard className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Dirección:</span>
                          <span className="font-medium flex items-center gap-1 text-right">
                            {order.customer.address || "No proporcionada"}
                            {order.customer.address && (
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    order.customer.address || "",
                                    `address-mobile-${order._id}`
                                  )
                                }
                                className="text-gray-400 hover:text-brand"
                                aria-label="Copiar dirección"
                              >
                                {copiedFields[`address-mobile-${order._id}`] ? (
                                  <ClipboardCheck className="h-4 w-4" />
                                ) : (
                                  <Clipboard className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Detalles del Pedido
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">N° Orden:</span>
                          <span className="font-medium flex items-center gap-1">
                            {order.orderNumber || "N/A"}
                            {order.orderNumber && (
                              <button
                                onClick={() =>
                                  copyToClipboard(order.orderNumber || "", `orderNumber-mobile-${order._id}`)
                                }
                                className="text-gray-400 hover:text-brand"
                                aria-label="Copiar número de orden"
                              >
                                {copiedFields[`orderNumber-mobile-${order._id}`] ? (
                                  <ClipboardCheck className="h-4 w-4" />
                                ) : (
                                  <Clipboard className="h-4 w-4" />
                                )}
                              </button>
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Método de pago:</span>
                          <span className="font-medium capitalize">
                            {order.paymentMethod}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fecha creación:</span>
                          <span className="font-medium">
                            {format(
                              new Date(order.createdAt),
                              "dd MMM yyyy HH:mm",
                              { locale: es }
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            Última actualización:
                          </span>
                          <span className="font-medium">
                            {format(
                              new Date(order.updatedAt),
                              "dd MMM yyyy HH:mm",
                              { locale: es }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Productos ({order.items.length})
                      </h4>
                      <ul className="space-y-3 text-sm">
                        {order.items.map((item, index) => (
                          <li key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-start">
                              <span className="font-medium text-gray-900">
                                {item.name}
                              </span>
                              <span className="font-medium">
                                ${(item.price * item.quantity).toLocaleString("es-AR")}
                              </span>
                            </div>
                            <div className="flex justify-between mt-1 text-gray-600">
                              <span>Cantidad: {item.quantity}</span>
                              <span>${item.price.toLocaleString("es-AR")} c/u</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Espaciadores para mantener el tamaño constante en móvil */}
          {currentOrders.length < ordersPerPage && 
            Array.from({ length: ordersPerPage - currentOrders.length }).map((_, index) => (
              <div key={`empty-mobile-${index}`} className="h-0"></div>
            ))
          }
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No se encontraron órdenes" : "No hay órdenes para mostrar"}
            </div>
          )}
        </div>
      </div>

      {/* Paginación */}
      {filteredOrders.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          {/* Versión móvil */}
          <div className="flex-1 flex justify-between items-center md:hidden">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="text-sm text-gray-700">
              Página <span className="font-medium">{currentPage}</span> de{" "}
              <span className="font-medium">{totalPages}</span>
            </div>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Versión desktop */}
          <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">
                  {Math.min((currentPage - 1) * ordersPerPage + 1, filteredOrders.length)}
                </span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(currentPage * ordersPerPage, filteredOrders.length)}
                </span>{" "}
                de <span className="font-medium">{filteredOrders.length}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                
                {getPageNumbers().map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === number
                        ? "z-10 bg-brand border-brand text-white"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {number}
                  </button>
                ))}
                
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Siguiente</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}