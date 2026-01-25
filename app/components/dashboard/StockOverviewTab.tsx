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
        const res = await fetch('/api/inventory/overview', {
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

  const filtered = data
    .map(cat => ({
      ...cat,
      productos: cat.productos.filter(p =>
        p.nombre.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(cat => cat.productos.length > 0)

  if (loading) return <p className="text-white/60">Cargando stock…</p>

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="flex justify-between items-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar producto…"
          className="bg-white/10 px-4 py-2 rounded-lg outline-none border border-white/20 w-72"
        />

        <span className="text-sm text-white/50">
          {filtered.reduce((acc, c) => acc + c.productos.length, 0)} productos
        </span>
      </div>

      {/* Categorías */}
      {filtered.map(cat => (
        <div key={cat._id} className="space-y-3">
          <h2 className="text-lg font-semibold text-indigo-300">
            {cat.nombre}
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {cat.productos.map(p => (
              <div
                key={p._id}
                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-indigo-400 transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{p.nombre}</h3>
                  <span className="text-xs text-white/50">
                    {p.codigoPrincipal}
                  </span>
                </div>

                {/* Variaciones */}
                <div className="space-y-2">
                  {p.variaciones.map(v => (
                    <div
                      key={v._id}
                      className={`flex justify-between items-center px-3 py-2 rounded-md text-sm ${
                        v.alerta
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-white/5'
                      }`}
                    >
                      <div>
                        <p className="font-medium">
                          {v.nombre} · {v.medida}
                        </p>
                        <p className="text-xs text-white/50">
                          Mín: {v.stockMinimo}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">{v.stock}</p>
                        <p className="text-xs text-white/50">
                          ${v.precio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
