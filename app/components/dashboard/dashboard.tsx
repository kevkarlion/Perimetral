'use client'

import { useState } from 'react'
import ProductsTab from './ProductsTab'
import CatalogTab from './catalog/CatalogoTab'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'products'>('products') // por ahora solo ProductsTab

  return (
    <main className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Panel de Administración</h1>
      
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row border-b border-gray-200 mb-6 overflow-x-auto">
        <button
          className={`py-2 px-4 font-medium mb-2 sm:mb-0 sm:mr-4 whitespace-nowrap ${
            activeTab === 'products' ? 'text-brand border-b-2 border-brand' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('products')}
        >
          Gestión de Productos
        </button>
      </div>

      {/* Contenido */}
      <div className="overflow-x-auto">
        {activeTab === 'products' && <CatalogTab />}
      </div>
    </main>
  )
}
