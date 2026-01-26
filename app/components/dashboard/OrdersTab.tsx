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
  totalBeforeDiscount?: number // opcional, para mostrar el original
  discountPercentage?: number // agregar esto
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
          data.orders.forEach((order: Order) => {
            initialDrafts[order._id] = {
              notes: order.notes ?? '',
              status: order.status ?? 'pending',
              discountPercentage: order.discountPercentage ?? 0,
            }
          })
          setDrafts(initialDrafts)
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
    
    // Si cambia el descuento, actualiza el totalBeforeDiscount en la orden
    if (field === 'discountPercentage') {
      const order = orders.find(o => o._id === id)
      if (order && !order.totalBeforeDiscount) {
        setOrders(prev =>
          prev.map(o =>
            o._id === id
              ? { ...o, totalBeforeDiscount: o.total }
              : o
          )
        )
      }
    }
  }

  const calculateTotalWithDiscount = (order: Order, discountPercentage: number) => {
    if (discountPercentage <= 0) return order.total
    
    const discountAmount = (order.total * discountPercentage) / 100
    return Math.max(0, order.total - discountAmount)
  }

  const saveOrder = async (order: Order) => {
    const draft = drafts[order._id]
    if (!draft) return

    const confirmSave = window.confirm('¿Desea guardar cambios?')
    if (!confirmSave) return

    setSavingOrders(prev => ({ ...prev, [order._id]: true }))
    
    try {
      // Prepara los datos a enviar
      const dataToSend: any = {
        notes: draft.notes,
        status: draft.status,
      }
      
      // Solo envía discountPercentage si es mayor a 0
      if (draft.discountPercentage > 0) {
        dataToSend.discountPercentage = draft.discountPercentage
      }
      
      console.log('Enviando datos:', dataToSend) // Debug
      
      const res = await fetch(`/api/orders/${order.accessToken}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(dataToSend),
      })
      
      console.log('Respuesta status:', res.status) // Debug
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('Error response:', errorText)
        throw new Error(`Error guardando orden: ${res.status}`)
      }
      
      const json = await res.json()
      console.log('Respuesta del servidor:', json) // Debug
      
      if (json.success && json.order) {
        // Actualiza la orden con los datos del backend
        const updatedOrder = json.order
        
        // Asegúrate de mantener el totalBeforeDiscount si aplica descuento
        const finalOrder = draft.discountPercentage > 0 
          ? { 
              ...updatedOrder, 
              totalBeforeDiscount: order.totalBeforeDiscount || order.total,
              discountPercentage: draft.discountPercentage 
            }
          : updatedOrder
        
        setOrders(prev =>
          prev.map(o => (o._id === finalOrder._id ? finalOrder : o))
        )
        
        // Actualiza el draft con lo que devolvió el backend
        setDrafts(prev => ({
          ...prev,
          [order._id]: {
            notes: updatedOrder.notes,
            status: updatedOrder.status,
            discountPercentage: draft.discountPercentage,
          },
        }))
        
        alert('¡Orden actualizada correctamente!')
      } else {
        throw new Error('Respuesta inesperada del servidor')
      }
    } catch (err) {
      console.error('Error detallado:', err)
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
          const draft = drafts[order._id] ?? { 
            notes: order.notes || '', 
            status: order.status || 'pending', 
            discountPercentage: order.discountPercentage || 0 
          }

          // Calcular el total a mostrar
          const displayedTotal = draft.discountPercentage > 0
            ? calculateTotalWithDiscount(order, draft.discountPercentage)
            : order.total

          return (
            <div key={order._id} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              {/* Header */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleOrder(order._id)}
              >
                <div className="space-y-1">
                  <p className="font-semibold text-white">{order.orderNumber}</p>
                  <p className="text-white/60 text-sm">
                    {order.customer.name} · {order.customer.email}
                  </p>
                  <p className="text-white/50 text-xs">
                    Fecha: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {draft.discountPercentage > 0 && (order.totalBeforeDiscount || order.total) && (
                    <p className="text-white/50 line-through">
                      ${order.totalBeforeDiscount || order.total}
                    </p>
                  )}
                  <p className="font-bold text-white">${displayedTotal.toFixed(2)}</p>
                  {draft.discountPercentage > 0 && (
                    <span className="text-xs text-green-400">
                      (-{draft.discountPercentage}%)
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
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-12 h-12 object-cover rounded" 
                            />
                          )}
                          <div className="text-white text-sm">
                            <p>{item.name}</p>
                            {item.medida && <p className="text-xs text-white/50">Medida: {item.medida}</p>}
                            {item.sku && <p className="text-xs text-white/50">SKU: {item.sku}</p>}
                            <p className="text-xs text-white/50">
                              {item.quantity} x ${item.price} = ${item.price * item.quantity}
                            </p>
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
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>

                    {/* Descuento */}
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-white font-semibold">Aplicar DTO:</p>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={draft.discountPercentage}
                        onChange={e =>
                          handleDraftChange(order._id, 'discountPercentage', Number(e.target.value))
                        }
                        className="w-16 text-xs bg-white/5 text-white/70 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        placeholder="%"
                      />
                      <span className="text-white/50 text-xs">%</span>
                      
                      {draft.discountPercentage > 0 && (
                        <div className="ml-2 text-xs text-green-400">
                          <p>Total original: ${order.totalBeforeDiscount || order.total}</p>
                          <p>Nuevo total: ${displayedTotal.toFixed(2)}</p>
                          <p>Descuento: -${((order.totalBeforeDiscount || order.total) * draft.discountPercentage / 100).toFixed(2)}</p>
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