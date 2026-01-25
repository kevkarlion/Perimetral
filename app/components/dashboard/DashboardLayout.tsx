'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import CatalogTab from './catalog/CatalogoTab'
import ProductsTab from './ProductsTab'

export default function DashboardLayout() {
  const [view, setView] = useState<'stock' | 'manage' | 'movements' | 'orders'>('stock')

  return (
    <div className="flex min-h-screen bg-[#0b0b0d] text-white">
      <Sidebar active={view} onChange={setView} />

      <main className="flex-1 ml-16 sm:ml-20 p-6">
        <h1 className="text-2xl font-semibold mb-6 text-white/90">
          Panel de Gestión
        </h1>

        <div className="bg-white/5 rounded-2xl p-5 backdrop-blur border border-white/10 shadow-xl">
          {view === 'stock' && <div>Stock completo</div>}
          {view === 'manage' && <CatalogTab />}
          {view === 'movements' && <div>Historial de movimientos</div>}
          {view === 'orders' && <div>Órdenes</div>}
        </div>
      </main>
    </div>
  )
}
