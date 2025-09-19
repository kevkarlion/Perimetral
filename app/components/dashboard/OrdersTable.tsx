import { useEffect, useState, useMemo } from "react";
import React from "react";
import { IOrder, IOrderItem } from "@/types/orderTypes";
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
  Package,
  FileText,
  Plus,
} from "lucide-react";
import { Types } from "mongoose";

// Extender la interfaz IOrderItem para incluir los campos opcionales
interface ExtendedOrderItem extends IOrderItem {
  variationName?: string;
  variationCode?: string;
  productName?: string;
  productCode?: string;
}

export default function OrdersTable() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [copiedFields, setCopiedFields] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [orderEdits, setOrderEdits] = useState<
    Record<
      string,
      { 
        discount?: number; 
        status?: string; 
        originalTotal?: number;
        notes?: string;
      }
    >
  >({});
  const [saving, setSaving] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState<string | null>(null);
  const [updatingStock, setUpdatingStock] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesEdits, setNotesEdits] = useState<Record<string, string>>({});
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

  // Función para iniciar edición de notas
  const startEditingNotes = (orderId: string) => {
    const order = orders.find(o => o._id === orderId);
    if (order) {
      setNotesEdits(prev => ({
        ...prev,
        [orderId]: order.notes || ''
      }));
      setEditingNotes(orderId);
    }
  };

  // Función para manejar cambios en las notas
  const handleNotesChange = (orderId: string, text: string) => {
    setNotesEdits(prev => ({
      ...prev,
      [orderId]: text
    }));
  };

  // Función para cancelar edición de notas
  const handleCancelNotes = (orderId: string) => {
    setNotesEdits(prev => {
      const newEdits = { ...prev };
      delete newEdits[orderId];
      return newEdits;
    });
    setEditingNotes(null);
  };

  // 🔹 NUEVA FUNCIÓN: Actualizar notas de la orden
  const updateOrderNotes = async (orderId: string, notes: string) => {
    try {
      const order = orders.find(o => o._id === orderId);
      if (!order) return;

      const response = await fetch(`/api/orders/${order.accessToken}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          notes,
          status: order.status // mantener el estado actual
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar las notas');
      }

      const result = await response.json();
      
      // Actualizar el estado local
      setOrders(prev => prev.map(o => 
        o._id === orderId ? { ...o, notes } as IOrder : o
      ));

      alert('Notas actualizadas correctamente');
      return result;
    } catch (error) {
      console.error('Error al actualizar notas:', error);
      throw error;
    }
  };

  // Función para guardar notas
  const handleSaveNotes = async (orderId: string) => {
    try {
      const notesToSave = notesEdits[orderId] || '';
      await updateOrderNotes(orderId, notesToSave);
      
      // Limpiar el estado de edición
      setNotesEdits(prev => {
        const newEdits = { ...prev };
        delete newEdits[orderId];
        return newEdits;
      });
      setEditingNotes(null);
    } catch (error) {
      console.error('Error al guardar notas:', error);
    }
  };

  // Filtrar órdenes por orderNumber - con manejo seguro
  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;

    return orders.filter((order) => {
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
        originalTotal: order.total,
        notes: order.notes || '',
      },
    });
  };

  const cancelEditing = (orderId: string) => {
    setEditingOrder(null);
    setEditingNotes(null);
    const newEdits = { ...orderEdits };
    delete newEdits[orderId];
    setOrderEdits(newEdits);
  };

  const updateOrderEdit = (orderId: string, field: string, value: any) => {
    setOrderEdits({
      ...orderEdits,
      [orderId]: {
        ...orderEdits[orderId],
        [field]: value,
      },
    });
  };

  const calculateDiscountedTotal = (orderId: string, originalTotal: number) => {
    const discount = orderEdits[orderId]?.discount || 0;
    return originalTotal - (originalTotal * discount) / 100;
  };

  // ✅ NUEVA FUNCIÓN: Actualizar stock cuando se completa una orden
  const updateStockFromOrder = async (order: IOrder) => {
    setUpdatingStock(order._id);
    console.log("order desdeORders", order);

    try {
      // Procesar cada item de la orden
      for (const item of order.items) {
        try {
          // Convertir ObjectId a string si es necesario - PARA productId
          const productId = safeIdToString(item.productId);

          // ✅ CONVERTIR variationId DE FORMA SEGURA - ESTA ES LA CLAVE
          let variationId: string | undefined = undefined;

          if (item.variationId) {
            variationId = safeIdToString(item.variationId);
          } else {
            // ✅ SI NO HAY variationId, USAR EL productId COMO variationId
            variationId = productId;
            console.log(
              `ℹ️  Usando productId como variationId para: ${item.name}`
            );
          }

          const updateData = {
            productId,
            variationId, // ✅ Ahora siempre tendrá un valor
            stock: item.quantity,
            action: "decrement" as const,
            productName: item.name,
            productCode: item.sku,
          };

          console.log("Enviando actualización de stock:", updateData);

          const response = await fetch("/api/stock", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
              `Error al actualizar stock para: ${item.name} - ${errorText}`
            );
          }

          const result = await response.json();
          if (!result.success) {
            throw new Error(result.error || "Error al actualizar stock");
          }

          console.log(`✅ Stock actualizado para: ${item.name}`);
        } catch (itemError) {
          console.error(`❌ Error procesando item "${item.name}":`, itemError);
          // Continuar con los siguientes items aunque falle uno
          continue;
        }
      }

      return true;
    } catch (error) {
      console.error("❌ Error en updateStockFromOrder:", error);
      throw error;
    } finally {
      setUpdatingStock(null);
    }
  };

  const confirmUpdateOrder = (orderId: string) => {
    console.log("Preparing to update order:", orderId);
    setOrderToUpdate(orderId);
    setShowConfirmDialog(true);
  };

  const updateOrder = async () => {
    if (!orderToUpdate) return;
    setSaving(orderToUpdate);
    setShowConfirmDialog(false);

    try {
      const edits = orderEdits[orderToUpdate];
      const order = orders.find((o) => o._id === orderToUpdate);

      if (!order) {
        throw new Error("Orden no encontrada");
      }

      const updatedData = {
        status: edits.status,
        discount: edits.discount,
        total: calculateDiscountedTotal(
          orderToUpdate,
          edits.originalTotal || order.total
        ),
      };

      // ✅ ACTUALIZAR STOCK SI EL ESTADO CAMBIA A "COMPLETED"
      if (edits.status === "completed" && order.status !== "completed") {
        console.log("Orden completada, actualizando stock...");
        await updateStockFromOrder(order);
      }

      // 🔹 ACTUALIZAR NOTAS SI HAY CAMBIOS
      if (edits.notes !== undefined && edits.notes !== order.notes) {
        await updateOrderNotes(orderToUpdate, edits.notes);
      }

      const response = await fetch(`/api/orders/${order.accessToken}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: updatedData.status,
          additionalData: {
            discount: updatedData.discount,
            total: updatedData.total,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la orden");
      }

      await fetchOrders();

      setEditingOrder(null);
      setEditingNotes(null);
      const newEdits = { ...orderEdits };
      delete newEdits[orderToUpdate];
      setOrderEdits(newEdits);

      alert("Orden actualizada correctamente");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error al actualizar la orden. Por favor, intenta nuevamente.");
    } finally {
      setSaving(null);
      setOrderToUpdate(null);
    }
  };

  // Función para convertir ObjectId a string de forma segura
  const safeIdToString = (id: any): string => {
    if (!id) {
      console.warn("⚠️ safeIdToString recibió valor null/undefined");
      return "";
    }

    if (typeof id === "string") {
      // Verificar si es un ObjectId string válido (24 caracteres hex)
      if (/^[0-9a-fA-F]{24}$/.test(id)) {
        return id;
      }
      return id; // Devolver igual aunque no sea ObjectId válido
    }

    if (typeof id === "object") {
      if ("_id" in id && id._id) {
        return id._id.toString();
      }
      if ("toString" in id) {
        return id.toString();
      }
    }

    console.warn("⚠️ safeIdToString: tipo no manejado", typeof id, id);
    return String(id);
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
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
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
    <div
      className="bg-white rounded-lg shadow overflow-hidden flex flex-col"
      style={{ minHeight: "800px" }}
    >
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
            {Math.min(
              (currentPage - 1) * ordersPerPage + 1,
              filteredOrders.length
            )}
          </span>{" "}
          a{" "}
          <span className="font-medium">
            {Math.min(currentPage * ordersPerPage, filteredOrders.length)}
          </span>{" "}
          de <span className="font-medium">{filteredOrders.length}</span>{" "}
          órdenes
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
                                onClick={() =>
                                  copyToClipboard(
                                    order.orderNumber || "",
                                    `orderNumber-${order._id}`
                                  )
                                }
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
                                  $
                                  {calculateDiscountedTotal(
                                    order._id,
                                    order.total
                                  ).toLocaleString("es-AR")}
                                </span>
                              </div>
                            </div>
                          ) : order.discount && order.discount > 0 ? (
                            <div className="flex items-center gap-1">
                              <span className="line-through text-gray-400 text-xs">
                                ${order.total.toLocaleString("es-AR")}
                              </span>
                              <span className="text-green-600">
                                $
                                {(
                                  order.total -
                                  (order.total * order.discount) / 100
                                ).toLocaleString("es-AR")}
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
                              value={
                                orderEdits[order._id]?.status || order.status
                              }
                              onChange={(e) =>
                                updateOrderEdit(
                                  order._id,
                                  "status",
                                  e.target.value
                                )
                              }
                              className="text-xs border border-gray-300 rounded-md p-1 focus:ring-brand focus:border-brand"
                            >
                              <option value="pending_payment">
                                Pendiente de pago
                              </option>
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
                                  disabled={
                                    saving === order._id ||
                                    updatingStock === order._id
                                  }
                                  className="text-green-600 hover:text-green-900 disabled:opacity-50"
                                  title="Guardar cambios"
                                >
                                  {saving === order._id ||
                                  updatingStock === order._id ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-600"></div>
                                  ) : (
                                    <Save className="h-5 w-5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => cancelEditing(order._id)}
                                  disabled={
                                    saving === order._id ||
                                    updatingStock === order._id
                                  }
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
                                    <div className="text-sm font-medium flex items-center gap-1">
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
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    <span className="text-sm text-gray-500 w-24">
                                      Teléfono:
                                    </span>
                                    <div className="text-sm font-medium flex items-center gap-1">
                                      {order.customer.phone ||
                                        "No proporcionado"}
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
                                          {copiedFields[
                                            `phone-${order._id}`
                                          ] ? (
                                            <ClipboardCheck className="h-4 w-4" />
                                          ) : (
                                            <Clipboard className="h-4 w-4" />
                                          )}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-start">
                                    <span className="text-sm text-gray-500 w-24">
                                      Dirección:
                                    </span>
                                    <div className="text-sm font-medium flex items-center gap-1">
                                      {order.customer.address ||
                                        "No proporcionada"}
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
                                          {copiedFields[
                                            `address-${order._id}`
                                          ] ? (
                                            <ClipboardCheck className="h-4 w-4" />
                                          ) : (
                                            <Clipboard className="h-4 w-4" />
                                          )}
                                        </button>
                                      )}
                                    </div>
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
                                    <div className="text-sm font-medium flex items-center gap-1">
                                      {order.orderNumber || "N/A"}
                                      {order.orderNumber && (
                                        <button
                                          onClick={() =>
                                            copyToClipboard(
                                              order.orderNumber || "",
                                              `full-orderNumber-${order._id}`
                                            )
                                          }
                                          className="text-gray-400 hover:text-brand"
                                        >
                                          {copiedFields[
                                            `full-orderNumber-${order._id}`
                                          ] ? (
                                            <ClipboardCheck className="h-4 w-4" />
                                          ) : (
                                            <Clipboard className="h-4 w-4" />
                                          )}
                                        </button>
                                      )}
                                    </div>
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
                                          value={
                                            orderEdits[order._id]?.discount || 0
                                          }
                                          onChange={(e) =>
                                            updateOrderEdit(
                                              order._id,
                                              "discount",
                                              Number(e.target.value)
                                            )
                                          }
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
                                      {format(
                                        new Date(order.createdAt),
                                        "PPPp",
                                        {
                                          locale: es,
                                        }
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex">
                                    <span className="text-sm text-gray-500 w-24">
                                      Actualizado:
                                    </span>
                                    <span className="text-sm font-medium">
                                      {format(
                                        new Date(order.updatedAt),
                                        "PPPp",
                                        {
                                          locale: es,
                                        }
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* 🔹 NUEVA SECCIÓN: Notas de la orden */}
                              <div className="md:col-span-2">
                                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                  <FileText className="h-4 w-4" />
                                  Notas de la Orden
                                </h4>
                                
                                {editingNotes === order._id ? (
                                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                                    <textarea
                                      value={notesEdits[order._id] || ''}
                                      onChange={(e) => handleNotesChange(order._id, e.target.value)}
                                      placeholder="Agregar notas sobre esta orden..."
                                      className="w-full p-3 border border-gray-300 rounded-md min-h-[100px] focus:ring-brand focus:border-brand"
                                      rows={4}
                                    />
                                    <div className="flex gap-2 mt-3">
                                      <button
                                        onClick={() => handleCancelNotes(order._id)}
                                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm"
                                      >
                                        Cancelar
                                      </button>
                                      <button
                                        onClick={() => handleSaveNotes(order._id)}
                                        className="px-4 py-2 bg-brand text-white rounded-md text-sm hover:bg-brand-dark"
                                      >
                                        Guardar Notas
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div 
                                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => startEditingNotes(order._id)}
                                  >
                                    {order.notes ? (
                                      <div className="flex justify-between items-start">
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                          {order.notes}
                                        </p>
                                        <Edit className="h-4 w-4 text-gray-400 hover:text-brand" />
                                      </div>
                                    ) : (
                                      <div className="flex justify-between items-center text-gray-500">
                                        <span className="text-sm italic">No hay notas para esta orden</span>
                                        <Plus className="h-4 w-4" />
                                      </div>
                                    )}
                                  </div>
                                )}
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
                                          {item.productId && (
                                            <div className="text-xs text-gray-500 mt-1">
                                              ID:{" "}
                                              {safeIdToString(item.productId)}
                                              {item.variationId &&
                                                ` | Variación: ${safeIdToString(
                                                  item.variationId
                                                )}`}
                                            </div>
                                          )}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                          {item.quantity}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                          ${item.price.toLocaleString("es-AR")}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                          $
                                          {(
                                            item.price * item.quantity
                                          ).toLocaleString("es-AR")}
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
                    Array.from({
                      length: ordersPerPage - currentOrders.length,
                    }).map((_, index) => (
                      <tr key={`empty-${index}`} className="h-16">
                        <td colSpan={8} className="px-4 py-4"></td>
                      </tr>
                    ))}
                </tbody>
              </table>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  {searchTerm
                    ? "No se encontraron órdenes"
                    : "No hay órdenes para mostrar"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Versión Móvil (sm e inferior) */}
        <div className="md:hidden">
          <div className="space-y-4 p-4">
            {currentOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {order.orderNumber || "N/A"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {format(new Date(order.createdAt), "dd MMM yyyy", {
                        locale: es,
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingOrder === order._id ? (
                      <>
                        <button
                          onClick={() => confirmUpdateOrder(order._id)}
                          disabled={
                            saving === order._id || updatingStock === order._id
                          }
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Guardar cambios"
                        >
                          {saving === order._id ||
                          updatingStock === order._id ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-600"></div>
                          ) : (
                            <Save className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() => cancelEditing(order._id)}
                          disabled={
                            saving === order._id || updatingStock === order._id
                          }
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
                          className="text-brand hover:text-brand-dark"
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
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-gray-500">Cliente</p>
                    <p className="font-medium">{order.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Productos</p>
                    <p className="font-medium">{order.items.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total</p>
                    <div className="font-medium">
                      {editingOrder === order._id ? (
                        <div className="flex flex-col">
                          <span className="line-through text-gray-400 text-xs">
                            ${order.total.toLocaleString("es-AR")}
                          </span>
                          <span className="text-green-600">
                            $
                            {calculateDiscountedTotal(
                              order._id,
                              order.total
                            ).toLocaleString("es-AR")}
                          </span>
                        </div>
                      ) : order.discount && order.discount > 0 ? (
                        <div className="flex flex-col">
                          <span className="line-through text-gray-400 text-xs">
                            ${order.total.toLocaleString("es-AR")}
                          </span>
                          <span className="text-green-600">
                            $
                            {(
                              order.total -
                              (order.total * order.discount) / 100
                            ).toLocaleString("es-AR")}
                          </span>
                        </div>
                      ) : (
                        `$${order.total.toLocaleString("es-AR")}`
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500">Estado</p>
                    {editingOrder === order._id ? (
                      <select
                        value={orderEdits[order._id]?.status || order.status}
                        onChange={(e) =>
                          updateOrderEdit(order._id, "status", e.target.value)
                        }
                        className="text-xs border border-gray-300 rounded-md p-1 focus:ring-brand focus:border-brand w-full"
                      >
                        <option value="pending_payment">
                          Pendiente de pago
                        </option>
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
                  </div>
                </div>

                {expandedOrder === order._id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Información del Cliente
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <div className="font-medium flex items-center gap-1">
                            {order.customer.email}
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  order.customer.email,
                                  `mobile-email-${order._id}`
                                )
                              }
                              className="text-gray-400 hover:text-brand"
                            >
                              {copiedFields[`mobile-email-${order._id}`] ? (
                                <ClipboardCheck className="h-3 w-3" />
                              ) : (
                                <Clipboard className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Teléfono:</span>
                          <div className="font-medium flex items-center gap-1">
                            {order.customer.phone || "No proporcionado"}
                            {order.customer.phone && (
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    order.customer.phone || "",
                                    `mobile-phone-${order._id}`
                                  )
                                }
                                className="text-gray-400 hover:text-brand"
                              >
                                {copiedFields[`mobile-phone-${order._id}`] ? (
                                  <ClipboardCheck className="h-3 w-3" />
                                ) : (
                                  <Clipboard className="h-3 w-3" />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Dirección:</span>
                          <div className="font-medium text-right max-w-xs">
                            {order.customer.address || "No proporcionada"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Detalles del Pedido
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Método de pago:</span>
                          <span className="font-medium capitalize">
                            {order.paymentMethod}
                          </span>
                        </div>
                        {editingOrder === order._id && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500">Descuento:</span>
                            <div className="flex items-center gap-2">
                              <Percent className="h-3 w-3 text-gray-400" />
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={orderEdits[order._id]?.discount || 0}
                                onChange={(e) =>
                                  updateOrderEdit(
                                    order._id,
                                    "discount",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-12 text-sm border border-gray-300 rounded-md p-1 focus:ring-brand focus:border-brand"
                              />
                              <span className="text-xs">%</span>
                            </div>
                          </div>
                        )}
                        {order.discount > 0 && !editingOrder && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Descuento:</span>
                            <span className="font-medium text-green-600">
                              {order.discount}% aplicado
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 🔹 NUEVA SECCIÓN MÓVIL: Notas */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Notas
                      </h4>
                      
                      {editingNotes === order._id ? (
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <textarea
                            value={notesEdits[order._id] || ''}
                            onChange={(e) => handleNotesChange(order._id, e.target.value)}
                            placeholder="Agregar notas..."
                            className="w-full p-2 border border-gray-300 rounded-md min-h-[80px] focus:ring-brand focus:border-brand text-sm"
                            rows={3}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleCancelNotes(order._id)}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-xs"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => handleSaveNotes(order._id)}
                              className="px-3 py-1 bg-brand text-white rounded-md text-xs hover:bg-brand-dark"
                            >
                              Guardar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="bg-gray-50 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100"
                          onClick={() => startEditingNotes(order._id)}
                        >
                          {order.notes ? (
                            <div className="flex justify-between items-start">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {order.notes}
                              </p>
                              <Edit className="h-3 w-3 text-gray-400 hover:text-brand mt-1" />
                            </div>
                          ) : (
                            <div className="flex justify-between items-center text-gray-500">
                              <span className="text-xs italic">No hay notas</span>
                              <Plus className="h-3 w-3" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        Productos
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-start border-b border-gray-100 pb-2"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-xs text-gray-500">
                                Cantidad: {item.quantity}
                              </p>
                              {item.productId && (
                                <p className="text-xs text-gray-500 mt-1">
                                  ID: {safeIdToString(item.productId)}
                                  {item.variationId &&
                                    ` | Variación: ${safeIdToString(
                                      item.variationId
                                    )}`}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                $
                                {(item.price * item.quantity).toLocaleString(
                                  "es-AR"
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                ${item.price.toLocaleString("es-AR")} c/u
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? "No se encontraron órdenes"
                  : "No hay órdenes para mostrar"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="hidden md:flex-1 md:flex md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">
                  {Math.min(
                    (currentPage - 1) * ordersPerPage + 1,
                    filteredOrders.length
                  )}
                </span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(currentPage * ordersPerPage, filteredOrders.length)}
                </span>{" "}
                de <span className="font-medium">{filteredOrders.length}</span>{" "}
                resultados
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>

                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? "z-10 bg-brand border-brand text-white"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <span className="sr-only">Siguiente</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>

          {/* Versión móvil de paginación */}
          <div className="md:hidden flex items-center justify-between w-full">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed bg-gray-100"
                  : "text-gray-700 bg-white hover:bg-gray-50"
              }`}
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página <span className="font-medium">{currentPage}</span> de{" "}
              <span className="font-medium">{totalPages}</span>
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed bg-gray-100"
                  : "text-gray-700 bg-white hover:bg-gray-50"
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Diálogo de confirmación */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar actualización
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              ¿Estás seguro de que deseas actualizar esta orden?
              {orderToUpdate &&
                orderEdits[orderToUpdate]?.status === "completed" &&
                " Esta acción también actualizará el stock de los productos."}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={updateOrder}
                className="px-4 py-2 bg-brand border border-transparent rounded-md text-sm font-medium text-white hover:bg-brand-dark"
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