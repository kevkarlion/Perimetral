'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import CatalogTab from './catalog/CatalogoTab'
import StockOverviewTab from './StockOverviewTab'
import StockMovementTab from './StockMovementTab'
import OrdersTab from './OrdersTab'
import { LogoutButton } from '@/app/components/LogoutButton'

export default function DashboardLayout() {
  const [view, setView] =
    useState<'stock' | 'manage' | 'movements' | 'orders'>('stock')

  return (
    <div className="flex min-h-screen bg-[#0b0b0d] text-white">
      <Sidebar active={view} onChange={setView} />

      <main className="flex-1 ml-16 sm:ml-20 p-6 space-y-6">

        {/* Top bar */}
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-3 backdrop-blur">
          <h1 className="text-lg sm:text-xl font-semibold text-white/90">
            Panel de Administración
          </h1>

          <LogoutButton />
        </div>

        {/* Card principal */}
        <div className="bg-white/5 rounded-2xl p-5 backdrop-blur border border-white/10 shadow-xl">
          {view === 'stock' && <StockOverviewTab />}
          {view === 'manage' && <CatalogTab />}
          {view === 'movements' && <StockMovementTab />}
          {view === 'orders' && <OrdersTab />}
        </div>

      </main>
    </div>
  )
}
