'use client'

import { useEffect, useState, useMemo } from 'react'

type StockMovementDTO = {
  _id: string
  productId?: { _id: string }
  variationId?: { _id: string; medida: string }
  type: 'IN' | 'OUT'
  reason: 'SALE' | 'ADJUSTMENT' | 'MANUAL'
  quantity: number
  previousStock: number
  newStock: number
  orderToken?: string
  createdAt: string
}

type NormalizedMovement = StockMovementDTO & {
  tipo: 'ingreso' | 'egreso' | 'ajuste'
  motivo: string
  productoId?: string
  medida?: string
}

export default function StockMovementsTab() {
  const [data, setData] = useState<StockMovementDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'ingreso' | 'egreso' | 'ajuste'>('all')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/stock-movements', { cache: 'no-store' })
        const text = await res.text()
        console.log('RAW RESPONSE:', text)

        const json = JSON.parse(text)

        if (Array.isArray(json)) {
          setData(json)
        } else {
          console.error('Respuesta no es array', json)
          setData([])
        }
      } catch (err) {
        console.error('No es JSON válido', err)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const normalized: NormalizedMovement[] = useMemo(() => {
    return data.map(m => ({
      ...m,
      tipo:
        m.type === 'IN'
          ? 'ingreso'
          : m.type === 'OUT'
          ? 'egreso'
          : 'ajuste',

      motivo:
        m.reason === 'SALE'
          ? 'Venta'
          : m.reason === 'ADJUSTMENT'
          ? 'Ajuste'
          : 'Manual',

      productoId: m.productId?._id,
      medida: m.variationId?.medida,
    }))
  }, [data])

  const filtered =
    filter === 'all'
      ? normalized
      : normalized.filter(m => m.tipo === filter)

  if (loading) return <p className="text-white/60">Cargando movimientos…</p>

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-3">
        {['all', 'ingreso', 'egreso', 'ajuste'].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t as any)}
            className={`px-4 py-1 rounded-full text-sm ${
              filter === t
                ? 'bg-indigo-500 text-white'
                : 'bg-white/10 text-white/60'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Producto ID</th>
              <th className="p-3 text-left">Medida</th>
              <th className="p-3 text-center">Tipo</th>
              <th className="p-3 text-center">Cantidad</th>
              <th className="p-3 text-left">Motivo</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Orden</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(m => (
              <tr
                key={m._id}
                className="border-t border-white/10 hover:bg-white/5"
              >
                <td className="p-3">
                  {new Date(m.createdAt).toLocaleString()}
                </td>

                <td className="p-3 text-xs text-white/70">
                  {m.productoId || '-'}
                </td>

                <td className="p-3">{m.medida || '-'}</td>

                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      m.tipo === 'ingreso'
                        ? 'bg-green-500/20 text-green-300'
                        : m.tipo === 'egreso'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}
                  >
                    {m.tipo}
                  </span>
                </td>

                <td className="p-3 text-center font-semibold">
                  {m.quantity}
                </td>

                <td className="p-3 text-white/70">{m.motivo}</td>

                <td className="p-3 text-xs text-white/60">
                  {m.previousStock} → {m.newStock}
                </td>

                <td className="p-3 text-xs text-indigo-300">
                  {m.orderToken || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
