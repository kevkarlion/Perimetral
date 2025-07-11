'use client'

import { useState } from 'react'
import ProductTable from '@/components/dashboard/ProductTable'
import OrdersTable from '@/components/dashboard/OrdersTable'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products')

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'products' ? 'text-brand border-b-2 border-brand' : 'text-gray-500'}`}
          onClick={() => setActiveTab('products')}
        >
          Gestión de Productos
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'orders' ? 'text-brand border-b-2 border-brand' : 'text-gray-500'}`}
          onClick={() => setActiveTab('orders')}
        >
          Órdenes
        </button>
      </div>

      {/* Content */}
      {activeTab === 'products' ? <ProductTable /> : <OrdersTable />}
    </main>
  )
}