'use client'

import { useEffect, useState } from 'react'
import { InventoryOverviewDTO } from '@/types/InventoryOverviewDTO'

export default function StockOverviewTab() {
  const [data, setData] = useState<InventoryOverviewDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/inventory/overview?page=${page}&limit=20&search=${search}', {
          cache: 'no-store',
        })
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error('Error cargando stock', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const filtered = data.map(cat => {
    const productosFiltrados = cat.productos.filter(p =>
      (p.nombre ?? '')
        .toLowerCase()
        .includes(search.toLowerCase())
    )

    return {
      ...cat,
      productos: productosFiltrados,
    }
  })

  if (loading) return <p className="text-white/60">Cargando stock…</p>

  return (
    <div className="space-y-4">
      {/* Título */}
      <h1 className="text-2xl font-bold text-white">
        Stock Completo
      </h1>

      {/* Buscador */}
      <div className="flex justify-between items-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar producto…"
          className="bg-white/10 px-4 py-2 rounded-lg outline-none border border-white/20 w-72 text-white"
        />

        <span className="text-sm text-white/50">
          {filtered.reduce(
            (acc, c) => acc + c.productos.length,
            0
          )}{' '}
          productos
        </span>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full text-sm text-left text-white">
          <thead className="bg-white/10 text-white/70">
            <tr>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Variación</th>
              <th className="px-4 py-3 text-center">
                Stock
              </th>
              <th className="px-4 py-3 text-center">
                Mín
              </th>
              <th className="px-4 py-3 text-right">
                Precio
              </th>
              <th className="px-4 py-3 text-center">
                Estado
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {filtered.map(cat => {
              if (!cat.productos || cat.productos.length === 0) {
                return (
                  <tr
                    key={cat._id}
                    className="text-white/40 italic"
                  >
                    <td className="px-4 py-2 text-indigo-300">
                      {cat.nombre}
                    </td>
                    <td colSpan={6} className="px-4 py-2">
                      Sin productos
                    </td>
                  </tr>
                )
              }

              return cat.productos.map(prod => {
                if (
                  !prod.variaciones ||
                  prod.variaciones.length === 0
                ) {
                  return (
                    <tr
                      key={prod._id}
                      className="hover:bg-white/5"
                    >
                      <td className="px-4 py-2 text-indigo-300">
                        {cat.nombre}
                      </td>

                      <td className="px-4 py-2">
                        <p className="font-medium">
                          {prod.nombre}
                        </p>
                        <p className="text-xs text-white/40">
                          {prod.codigoPrincipal}
                        </p>
                      </td>

                      <td className="px-4 py-2 italic text-white/40">
                        Sin variaciones
                      </td>

                      <td
                        colSpan={4}
                        className="px-4 py-2 text-white/30"
                      >
                        —
                      </td>
                    </tr>
                  )
                }

                return prod.variaciones.map(v => (
                  <tr
                    key={v._id}
                    className={`hover:bg-white/5 ${
                      v.alerta ? 'bg-red-500/10' : ''
                    }`}
                  >
                    <td className="px-4 py-2 text-indigo-300">
                      {cat.nombre}
                    </td>

                    <td className="px-4 py-2">
                      <p className="font-medium">
                        {prod.nombre}
                      </p>
                      <p className="text-xs text-white/40">
                        {prod.codigoPrincipal}
                      </p>
                    </td>

                    <td className="px-4 py-2">
                      {v.nombre} · {v.medida}
                    </td>

                    <td className="px-4 py-2 text-center font-semibold">
                      {v.stock}
                    </td>

                    <td className="px-4 py-2 text-center text-white/60">
                      {v.stockMinimo}
                    </td>

                    <td className="px-4 py-2 text-right">
                      ${v.precio}
                    </td>

                    <td className="px-4 py-2 text-center">
                      {v.alerta ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-500/30 text-red-300">
                          Bajo stock
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              })
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
