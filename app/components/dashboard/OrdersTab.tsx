'use client'

import { useEffect, useState } from 'react'

type OrderItem = {
  _id: string
  productId: string
  variationId: string
  name: string
  price: number
  quantity: number
  image?: string
  medida?: string
  sku?: string
}

type PaymentDetails = {
  status: 'pending' | 'approved' | 'rejected' | 'refunded'
  method?: 'mercadopago' | 'transferencia' | 'efectivo' | 'tarjeta'
  transactionId?: string
  paymentUrl?: string
  approvedAt?: string
}

type Customer = {
  name: string
  email: string
  phone?: string
  address?: string
}

type Order = {
  _id: string
  orderNumber: string
  accessToken: string
  customer: Customer
  items: OrderItem[]
  subtotal: number
  vat: number
  shippingCost: number
  total: number
  totalBeforeDiscount?: number
  discountPercentage?: number
  status:
    | 'pending'
    | 'pending_payment'
    | 'processing'
    | 'completed'
    | 'payment_failed'
    | 'cancelled'
  paymentMethod: string
  paymentDetails: PaymentDetails
  notes: string
  createdAt: string
  updatedAt: string
}

type Draft = {
  notes: string
  status: Order['status']
  discountPercentage: number
}

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})
  const [savingOrders, setSavingOrders] = useState<Record<string, boolean>>({})
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [tempDiscounts, setTempDiscounts] = useState<Record<string, number>>({})
  const [appliedDiscounts, setAppliedDiscounts] = useState<Record<string, boolean>>({})

  const STATUS_OPTIONS: Order['status'][] = [
    'pending',
    'pending_payment',
    'processing',
    'completed',
    'payment_failed',
    'cancelled',
  ]

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/orders')
        const data = await res.json()
        if (data && data.orders) {
          setOrders(data.orders)

          const initialDrafts: Record<string, Draft> = {}
          const initialAppliedDiscounts: Record<string, boolean> = {}
          
          data.orders.forEach((order: Order) => {
            initialDrafts[order._id] = {
              notes: order.notes ?? '',
              status: order.status ?? 'pending',
              discountPercentage: order.discountPercentage ?? 0,
            }
            // Marcar como aplicado si ya hay descuento desde backend
            if (order.discountPercentage && order.discountPercentage > 0) {
              initialAppliedDiscounts[order._id] = true
            }
          })
          
          setDrafts(initialDrafts)
          setAppliedDiscounts(initialAppliedDiscounts)
        }
      } catch (err) {
        console.error(err)
        alert('Error cargando órdenes')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggleOrder = (id: string) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleDraftChange = (id: string, field: keyof Draft, value: any) => {
    setDrafts(prev => ({
      ...prev,
      [id]: { 
        ...(prev[id] ?? { 
          notes: '', 
          status: 'pending', 
          discountPercentage: 0 
        }), 
        [field]: value 
      },
    }))
  }

  const handleDiscountInputChange = (orderId: string, value: number) => {
    // Solo actualizar si no hay descuento ya aplicado desde backend
    const order = orders.find(o => o._id === orderId)
    if (order && order.discountPercentage && order.discountPercentage > 0) {
      return // No permitir cambios si ya hay descuento aplicado
    }
    
    // Solo actualizar si no se ha aplicado manualmente en esta sesión
    if (appliedDiscounts[orderId]) {
      return
    }
    
    handleDraftChange(orderId, 'discountPercentage', value)
    setTempDiscounts(prev => ({ ...prev, [orderId]: value }))
  }

  const applyDiscount = (order: Order) => {
    const draft = drafts[order._id]
    if (!draft) return

    // Si ya hay un descuento aplicado desde backend, no permitir
    if (order.discountPercentage && order.discountPercentage > 0) {
      alert('Ya se aplicó un descuento a esta orden.')
      return
    }

    // Validar el descuento
    if (draft.discountPercentage <= 0) {
      alert('Por favor ingrese un porcentaje de descuento válido (mayor a 0).')
      return
    }

    if (draft.discountPercentage > 100) {
      alert('El descuento no puede ser mayor al 100%.')
      return
    }

    // Mostrar confirmación
    const confirmApply = window.confirm(
      `¿Está seguro de aplicar un descuento del ${draft.discountPercentage}%?\n\n` +
      `Total original: $${order.total.toFixed(2)}\n` +
      `Nuevo total: $${calculateTotalWithDiscount(order, draft.discountPercentage).toFixed(2)}`
    )
    
    if (!confirmApply) {
      return
    }

    // Marcar como aplicado y bloquear el input
    setAppliedDiscounts(prev => ({ ...prev, [order._id]: true }))
    
    alert(`Descuento del ${draft.discountPercentage}% aplicado exitosamente. Recuerde guardar los cambios para que se aplique permanentemente.`)
  }

  const removeDiscount = (order: Order) => {
    const confirmRemove = window.confirm('¿Está seguro de quitar el descuento?')
    
    if (!confirmRemove) {
      return
    }

    // Resetear el descuento
    handleDraftChange(order._id, 'discountPercentage', 0)
    setTempDiscounts(prev => ({ ...prev, [order._id]: 0 }))
    setAppliedDiscounts(prev => ({ ...prev, [order._id]: false }))
  }

  const calculateTotalWithDiscount = (order: Order, discountPercentage: number) => {
    if (!discountPercentage || discountPercentage <= 0) return order.total
    
    const discountMultiplier = (100 - discountPercentage) / 100
    return order.total * discountMultiplier
  }

  const saveOrder = async (order: Order) => {
    const draft = drafts[order._id]
    if (!draft) return

    // Validar que si hay descuento, sea positivo y no mayor a 100
    if (draft.discountPercentage > 0) {
      if (draft.discountPercentage > 100) {
        alert('El descuento no puede ser mayor al 100%')
        return
      }
    }

    const confirmSave = window.confirm('¿Desea guardar cambios?')
    if (!confirmSave) return

    setSavingOrders(prev => ({ ...prev, [order._id]: true }))
    
    try {
      const dataToSend: any = {
        notes: draft.notes,
        status: draft.status,
      }
      
      // LÓGICA CRÍTICA CORREGIDA:
      // Solo enviamos discountPercentage si:
      // 1. No hay descuento aplicado desde backend Y estamos aplicando uno nuevo
      // 2. O estamos quitando un descuento (poniéndolo en 0)
      // 3. O el descuento en el draft es DIFERENTE al que ya existe en el backend
      
      const hasBackendDiscount = order.discountPercentage && order.discountPercentage > 0
      const isApplyingNewDiscount = draft.discountPercentage > 0
      const isRemovingDiscount = !draft.discountPercentage && hasBackendDiscount
      const isChangingExistingDiscount = hasBackendDiscount && 
        draft.discountPercentage !== order.discountPercentage
      
      // Solo enviamos discountPercentage en estos casos:
      if ((!hasBackendDiscount && isApplyingNewDiscount) || 
          isRemovingDiscount || 
          isChangingExistingDiscount) {
        dataToSend.discountPercentage = draft.discountPercentage
      }
      // Si hay descuento en backend y es el mismo valor, NO lo enviamos
      
      const res = await fetch(`/api/orders/${order.accessToken}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Error guardando orden')
      }
      
      const json = await res.json()
      if (!json.success || !json.order) throw new Error('Respuesta inesperada del servidor')
      
      const updatedOrder = json.order
      
      // Actualizamos estado y draft con valores devueltos por backend
      setOrders(prev =>
        prev.map(o => (o._id === updatedOrder._id ? updatedOrder : o))
      )
      setDrafts(prev => ({
        ...prev,
        [order._id]: {
          notes: updatedOrder.notes,
          status: updatedOrder.status,
          discountPercentage: updatedOrder.discountPercentage || 0,
        },
      }))
      
      // Actualizar estado de descuento aplicado basado en respuesta del backend
      if (updatedOrder.discountPercentage && updatedOrder.discountPercentage > 0) {
        setAppliedDiscounts(prev => ({ ...prev, [order._id]: true }))
      } else {
        setAppliedDiscounts(prev => ({ ...prev, [order._id]: false }))
      }
      
      // Limpiar descuento temporal después de guardar
      setTempDiscounts(prev => ({ ...prev, [order._id]: 0 }))
      
      alert('¡Orden actualizada correctamente!')
    } catch (err) {
      console.error(err)
      alert('Error guardando orden: ' + (err instanceof Error ? err.message : 'Error desconocido'))
    } finally {
      setSavingOrders(prev => ({ ...prev, [order._id]: false }))
    }
  }

  if (loading) return <div className="text-white/60">Cargando órdenes...</div>
  if (orders.length === 0) return <div className="text-white/60">No hay órdenes</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Órdenes</h1>

      <div className="space-y-4">
        {orders.map(order => {
          const isExpanded = !!expandedOrders[order._id]
          const draft = drafts[order._id] ?? { notes: '', status: 'pending', discountPercentage: 0 }
          const dtoAppliedFromBackend = !!(order.discountPercentage && order.discountPercentage > 0)
          const dtoAppliedManually = appliedDiscounts[order._id] || false
          const dtoApplied = dtoAppliedFromBackend || dtoAppliedManually
          const tempDiscount = tempDiscounts[order._id] || 0
          
          // Determinar qué descuento mostrar
          const currentDiscount = tempDiscount > 0 ? tempDiscount : draft.discountPercentage
          
          // Calcular total a mostrar
          const displayedTotal = dtoAppliedFromBackend 
            ? order.total 
            : calculateTotalWithDiscount(order, currentDiscount)

          // Determinar si el input debe estar bloqueado
          const isInputDisabled = dtoAppliedFromBackend || dtoAppliedManually

          return (
            <div key={order._id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              {/* Header */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleOrder(order._id)}
              >
                <div className="space-y-1">
                  <p className="font-semibold text-white">{order.orderNumber}</p>
                  <p className="text-white/60 text-sm">{order.customer.name} · {order.customer.email}</p>
                  <p className="text-white/50 text-xs">Fecha: {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Mostrar precio original si hay descuento */}
                  {(dtoApplied || currentDiscount > 0) && (
                    <p className="text-white/50 line-through">${order.total.toFixed(2)}</p>
                  )}
                  <p className="font-bold text-white">${displayedTotal.toFixed(2)}</p>
                  {/* Mostrar porcentaje de descuento si existe */}
                  {(dtoApplied || currentDiscount > 0) && (
                    <span className="text-xs text-green-400">
                      {dtoAppliedFromBackend ? `(-${order.discountPercentage}%)` : `(-${currentDiscount}%)`}
                    </span>
                  )}
                  <span
                    className={`text-sm font-semibold ${
                      draft.status === 'completed'
                        ? 'text-green-400'
                        : draft.status === 'processing'
                        ? 'text-yellow-400'
                        : 'text-white/60'
                    }`}
                  >
                    {draft.status}
                  </span>
                  <span className="text-white/50 text-lg transform transition-transform duration-200">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
                  {/* Productos */}
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    <h4 className="text-white/70 font-semibold">Productos comprados</h4>
                    {order.items.map(item => (
                      <div key={item._id} className="flex justify-between items-center border-b border-white/10 pb-1">
                        <div className="flex items-center gap-2">
                          {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />}
                          <div className="text-white text-sm">
                            <p>{item.name}</p>
                            {item.medida && <p className="text-xs text-white/50">Medida: {item.medida}</p>}
                            {item.sku && <p className="text-xs text-white/50">SKU: {item.sku}</p>}
                            <p className="text-xs text-white/50">{item.quantity} x ${item.price} = ${item.price * item.quantity}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Notas y estado */}
                  <div className="space-y-2 mt-4">
                    <label className="block text-white/70">Notas</label>
                    <textarea
                      value={draft.notes}
                      onChange={e => handleDraftChange(order._id, 'notes', e.target.value)}
                      className="w-full bg-white/5 text-white/70 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                      rows={3}
                      placeholder="Agregar nota..."
                    />

                    <label className="block text-white/70 mt-2">Estado</label>
                    <select
                      value={draft.status}
                      onChange={e => handleDraftChange(order._id, 'status', e.target.value as Order['status'])}
                      className="w-full bg-white/5 text-white/70 rounded text-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status.replace('_', ' ')}</option>
                      ))}
                    </select>

                    {/* Descuento */}
                    <div className="mt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <p className="text-white font-semibold">Aplicar DTO:</p>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={currentDiscount}
                            onChange={(e) => handleDiscountInputChange(order._id, Number(e.target.value))}
                            disabled={isInputDisabled}
                            className="w-16 text-xs bg-white/5 text-white/70 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            placeholder="%"
                          />
                          <span className="text-white/50 text-xs">%</span>
                          
                          {/* Botones de acción */}
                          <div className="flex gap-2">
                            {!dtoAppliedFromBackend && (
                              <>
                                {!dtoAppliedManually ? (
                                  <button
                                    onClick={() => applyDiscount(order)}
                                    disabled={draft.discountPercentage <= 0 || draft.discountPercentage > 100 || isInputDisabled}
                                    className="px-3 py-1 text-xs rounded bg-green-500/20 text-green-300 hover:bg-green-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Aplicar
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => removeDiscount(order)}
                                    className="px-3 py-1 text-xs rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                                  >
                                    Quitar
                                  </button>
                                )}
                              </>
                            )}
                            
                            {dtoAppliedFromBackend && (
                              <span className="text-xs text-green-400 px-2 py-1">
                                (Descuento ya aplicado)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Mostrar cálculo en tiempo real */}
                      {(currentDiscount > 0 || dtoApplied) && (
                        <div className="text-xs text-green-400 bg-green-400/10 p-2 rounded">
                          <p>Total original: ${order.total.toFixed(2)}</p>
                          <p>Descuento: {dtoAppliedFromBackend ? order.discountPercentage : currentDiscount}% (-${(order.total * (dtoAppliedFromBackend ? order.discountPercentage! : currentDiscount) / 100).toFixed(2)})</p>
                          <p className="font-semibold">Nuevo total: ${displayedTotal.toFixed(2)}</p>
                          {dtoAppliedManually && !dtoAppliedFromBackend && (
                            <p className="text-yellow-400 text-xs mt-1">
                              * Recuerde guardar cambios para aplicar el descuento permanentemente
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Guardar */}
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => saveOrder(order)}
                      disabled={savingOrders[order._id]}
                      className="px-4 py-2 rounded bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingOrders[order._id] ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}