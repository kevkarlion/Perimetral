'use client'

import { useState } from 'react'
import ProductTable from '@/app/components/dashboard/ProductTable'
import OrdersTable from '@/app/components/dashboard/OrdersTable'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products')

  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Panel de Administración</h1>
      
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium mb-2 sm:mb-0 sm:mr-4 ${
            activeTab === 'products'
              ? 'text-brand border-b-2 border-brand'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('products')}
        >
          Gestión de Productos
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === 'orders'
              ? 'text-brand border-b-2 border-brand'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('orders')}
        >
          Órdenes
        </button>
      </div>

      {/* Content */}
      <div className="overflow-x-auto">
        {activeTab === 'products' ? <ProductTable /> : <OrdersTable />}
      </div>
    </main>
  )
}
