'use client'

import { useEffect, useState } from 'react'

type Order = {
  _id: string
  orderNumber: string
  status: string
  total: number
  createdAt: string
  customer: {
    name: string
    email: string
  }
}

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/orders')

        const json = await res.json()

        // 👇 ACA ESTA LA CLAVE
        const list = json.orders

        if (!Array.isArray(list)) {
          console.error('No es array', json)
          setOrders([])
          return
        }

        setOrders(list)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <div>Cargando órdenes...</div>

  if (orders.length === 0) return <div>No hay órdenes</div>

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div
          key={o._id}
          className="bg-white/5 border border-white/10 rounded-xl p-4"
        >
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">{o.orderNumber}</p>
              <p className="text-sm text-white/60">
                {o.customer.name} · {o.customer.email}
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold">${o.total}</p>
              <p className="text-sm text-white/60">{o.status}</p>
            </div>
          </div>

          <p className="text-xs text-white/40 mt-2">
            {new Date(o.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  )
}
