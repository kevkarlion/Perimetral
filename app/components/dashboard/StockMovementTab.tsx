'use client'

import { useEffect, useState, useMemo } from 'react'

// Interfaces
type ProductInfo = {
  _id: string
  nombre: string
  codigoPrincipal?: string
}

type VariationInfo = {
  _id: string
  nombre: string
  medida: string
}

type StockMovementDTO = {
  _id: string
  productId?: ProductInfo
  variationId?: VariationInfo
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
  productoNombre: string
  codigo: string
  variacionNombre: string
  medida: string
}

// Valores por defecto
const defaultProduct: ProductInfo = { _id: '', nombre: 'Sin nombre', codigoPrincipal: 'Sin código' }
const defaultVariation: VariationInfo = { _id: '', nombre: 'Sin variación', medida: 'Sin medida' }

export default function StockMovementsTab() {
  const [data, setData] = useState<StockMovementDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'ingreso' | 'egreso' | 'ajuste'>('all')

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 20

  // Carga los movimientos con paginado
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/stock-movements?page=${page}&limit=${limit}`, { cache: 'no-store' })
        const json = await res.json()
        setData(Array.isArray(json.data) ? json.data : [])
        setTotalPages(Math.ceil(json.total / limit))
      } catch (err) {
        console.error(err)
        setData([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page])

  // Normaliza los datos
  const normalized: NormalizedMovement[] = useMemo(() => {
    return data.map(m => {
      const product: ProductInfo = m.productId || defaultProduct
      const variation: VariationInfo = m.variationId || defaultVariation

      let tipo: 'ingreso' | 'egreso' | 'ajuste' = m.type === 'IN' ? 'ingreso' : m.type === 'OUT' ? 'egreso' : 'ajuste'

      let motivo: string
      switch (m.reason) {
        case 'SALE': motivo = 'Venta'; break
        case 'ADJUSTMENT': motivo = 'Ajuste'; break
        case 'MANUAL': motivo = 'Manual'; break
        default: motivo = m.reason
      }

      return {
        ...m,
        tipo,
        motivo,
        productoNombre: product.nombre,
        codigo: product.codigoPrincipal || 'Sin código',
        variacionNombre: variation.nombre,
        medida: variation.medida
      }
    })
  }, [data])

  const filtered = filter === 'all' ? normalized : normalized.filter(m => m.tipo === filter)

  if (loading) return <p className="text-white/60">Cargando movimientos…</p>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-white">Movimientos de Stock</h1>

      {/* Filtros */}
      <div className="flex gap-3">
        {['all', 'ingreso', 'egreso', 'ajuste'].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t as any)}
            className={`px-4 py-1 rounded-full text-sm ${
              filter === t ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60'
            }`}
          >
            {t === 'all' ? 'Todos' : t}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="p-3 text-left">Fecha</th>
              <th className="p-3 text-left">Producto</th>
              <th className="p-3 text-left">Variación</th>
              <th className="p-3 text-center">Tipo</th>
              <th className="p-3 text-center">Cantidad</th>
              <th className="p-3 text-left">Motivo</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Orden</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-white/50">
                  No hay movimientos para mostrar
                </td>
              </tr>
            ) : (
              filtered.map(m => (
                <tr key={m._id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-3">
                    {new Date(m.createdAt).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-white">{m.productoNombre}</p>
                    <p className="text-xs text-white/50">{m.codigo}</p>
                  </td>
                  <td className="p-3">
                    <p className="text-white">{m.variacionNombre}</p>
                    <p className="text-xs text-white/50">{m.medida}</p>
                  </td>
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
                  <td className="p-3 text-center font-semibold">{m.quantity}</td>
                  <td className="p-3 text-white/70">{m.motivo}</td>
                  <td className="p-3 text-xs text-white/60">
                    {m.previousStock} → {m.newStock}
                  </td>
                  <td className="p-3 text-xs text-indigo-300">{m.orderToken || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginado */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-white/10 rounded text-white/70 disabled:opacity-50"
        >
          Anterior
        </button>

        <span className="text-white/70 px-2">{page} / {totalPages}</span>

        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-white/10 rounded text-white/70 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}
