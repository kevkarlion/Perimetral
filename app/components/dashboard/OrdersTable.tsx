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
  Edit,
  CheckCircle,
  XCircle,
  Save,
  Percent,
  DollarSign,
} from "lucide-react";

export default function OrdersTable() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [copiedFields, setCopiedFields] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [orderEdits, setOrderEdits] = useState<Record<string, { discount?: number; status?: string; originalTotal?: number }>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState<string | null>(null);
  const ordersPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

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

  // Filtrar órdenes por orderNumber - con manejo seguro
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    
    return orders.filter(order => {
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
      case "pending_payment":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado";
      case "cancelled":
        return "Cancelado";
      case "pending_payment":
        return "Pendiente de pago";
      case "processing":
        return "En proceso";
      default:
        return status;
    }
  };

  const startEditing = (order: IOrder) => {
    setEditingOrder(order._id);
    setOrderEdits({
      ...orderEdits,
      [order._id]: {
        discount: order.discount || 0,
        status: order.status,
        originalTotal: order.total
      }
    });
  };

  const cancelEditing = (orderId: string) => {
    setEditingOrder(null);
    const newEdits = { ...orderEdits };
    delete newEdits[orderId];
    setOrderEdits(newEdits);
  };

  const updateOrderEdit = (orderId: string, field: string, value: any) => {
    setOrderEdits({
      ...orderEdits,
      [orderId]: {
        ...orderEdits[orderId],
        [field]: value
      }
    });
  };

  const calculateDiscountedTotal = (orderId: string, originalTotal: number) => {
    const discount = orderEdits[orderId]?.discount || 0;
    return originalTotal - (originalTotal * discount / 100);
  };

  const confirmUpdateOrder = (orderId: string) => {
    setOrderToUpdate(orderId);
    setShowConfirmDialog(true);
  };

  const updateOrder = async () => {
    if (!orderToUpdate) return;
    
    setSaving(orderToUpdate);
    setShowConfirmDialog(false);
    
    try {
      const edits = orderEdits[orderToUpdate];
      const order = orders.find(o => o._id === orderToUpdate);
      
      if (!order) {
        throw new Error("Orden no encontrada");
      }

      const updatedData = {
        status: edits.status,
        discount: edits.discount,
        total: calculateDiscountedTotal(orderToUpdate, edits.originalTotal || order.total)
      };

      const response = await fetch(`/api/orders/${orderToUpdate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la orden");
      }

      // Actualizar la lista de órdenes
      await fetchOrders();
      
      // Salir del modo edición
      setEditingOrder(null);
      const newEdits = { ...orderEdits };
      delete newEdits[orderToUpdate];
      setOrderEdits(newEdits);
      
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error al actualizar la orden. Por favor, intenta nuevamente.");
    } finally {
      setSaving(null);
      setOrderToUpdate(null);
    }
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
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
              setCurrentPage(1);
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
                          {editingOrder === order._id ? (
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <span className="line-through text-gray-400 mr-1">
                                  ${order.total.toLocaleString("es-AR")}
                                </span>
                                <span className="text-green-600">
                                  ${calculateDiscountedTotal(order._id, order.total).toLocaleString("es-AR")}
                                </span>
                              </div>
                            </div>
                          ) : order.discount && order.discount > 0 ? (
                            <div className="flex items-center gap-1">
                              <span className="line-through text-gray-400 text-xs">
                                ${order.total.toLocaleString("es-AR")}
                              </span>
                              <span className="text-green-600">
                                ${(order.total - (order.total * order.discount / 100)).toLocaleString("es-AR")}
                              </span>
                              <span className="bg-green-100 text-green-800 text-xs px-1 py-0.5 rounded">
                                -{order.discount}%
                              </span>
                            </div>
                          ) : (
                            `$${order.total.toLocaleString("es-AR")}`
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {editingOrder === order._id ? (
                            <select
                              value={orderEdits[order._id]?.status || order.status}
                              onChange={(e) => updateOrderEdit(order._id, "status", e.target.value)}
                              className="text-xs border border-gray-300 rounded-md p-1 focus:ring-brand focus:border-brand"
                            >
                              <option value="pending_payment">Pendiente de pago</option>
                              <option value="processing">En proceso</option>
                              <option value="completed">Completado</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                          ) : (
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusText(order.status)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(order.createdAt), "dd MMM yyyy", {
                            locale: es,
                          })}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            {editingOrder === order._id ? (
                              <>
                                <button
                                  onClick={() => confirmUpdateOrder(order._id)}
                                  disabled={saving === order._id}
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                  title="Guardar cambios"
                                >
                                  {saving === order._id ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-600"></div>
                                  ) : (
                                    <Save className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => cancelEditing(order._id)}
                                  disabled={saving === order._id}
                                  className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                  title="Cancelar edición"
                                >
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditing(order)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Editar orden"
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
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
                                    <ChevronUp className="h-5 w-5" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5" />
                                  )}
                                </button>
                              </>
                            )}
                          </div>
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
                                  {editingOrder === order._id && (
                                    <div className="flex items-center">
                                      <span className="text-sm text-gray-500 w-24">
                                        Descuento:
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <Percent className="h-4 w-4 text-gray-400" />
                                        <input
                                          type="number"
                                          min="0"
                                          max="100"
                                          value={orderEdits[order._id]?.discount || 0}
                                          onChange={(e) => updateOrderEdit(order._id, "discount", Number(e.target.value))}
                                          className="w-16 text-sm border border-gray-300 rounded-md p-1 focus:ring-brand focus:border-brand"
                                        />
                                        <span className="text-sm">%</span>
                                      </div>
                                    </div>
                                  )}
                                  {order.discount > 0 && !editingOrder && (
                                    <div className="flex">
                                      <span className="text-sm text-gray-500 w-24">
                                        Descuento:
                                      </span>
                                      <span className="text-sm font-medium text-green-600">
                                        {order.discount}% aplicado
                                      </span>
                                    </div>
                                  )}
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

        {/* Versión Mobile - Similar a desktop pero simplificada */}
        <div className="md:hidden space-y-4 p-4">
          {currentOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow p-4 border border-gray-100">
              {/* Contenido móvil simplificado */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{order.customer.name}</h3>
                  <p className="text-xs text-gray-500">{order.customer.email}</p>
                </div>
                <span className={`px-2 text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <p className="text-gray-500">N° Orden</p>
                  <p className="font-medium">{order.orderNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total</p>
                  <p className="font-medium">${order.total.toLocaleString("es-AR")}</p>
                </div>
                <div>
                  <p className="text-gray-500">Productos</p>
                  <p className="font-medium">{order.items.length}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha</p>
                  <p className="font-medium">
                    {format(new Date(order.createdAt), "dd MMM yy", { locale: es })}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <p className="text-sm text-gray-900">{order.customer.phone || "Sin teléfono"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEditing(order)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Editar orden"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleExpand(order._id)}
                    className="text-brand hover:text-brand-dark"
                  >
                    {expandedOrder === order._id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              
              {/* Detalles expandidos en móvil */}
              {expandedOrder === order._id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {/* Contenido similar al desktop pero adaptado a móvil */}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Paginación */}
      {filteredOrders.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          {/* Código de paginación existente */}
        </div>
      )}

      {/* Diálogo de confirmación */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar cambios</h3>
            <p className="text-sm text-gray-500 mb-4">
              ¿Estás seguro de que deseas aplicar estos cambios? Esta acción actualizará el estado de la orden, 
              aplicará el descuento y actualizará el stock correspondiente.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={updateOrder}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}