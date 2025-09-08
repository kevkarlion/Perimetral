'use client'

import { useEffect, useState } from 'react'
import { useStock } from '@/app/components/hooks/useStock'
import StockFilters from './StockFilters'
import StockMovementsTable from './StockMovementsTable'
import LowStockTable from '@/app/components/stock/LowStockList'

type Tab = 'movements' | 'low-stock'

export default function StockManagement() {
  const { movements, loading, fetchMovements, createMovement } = useStock()
  const [activeTab, setActiveTab] = useState<Tab>('movements')
  const [lowStockLoading, setLowStockLoading] = useState(false)
  const [contentLoading, setContentLoading] = useState(false)

  useEffect(() => { 
    setContentLoading(true)
    fetchMovements().finally(() => {
      setContentLoading(false)
    })
  }, [])

  const handleCreate = async (data: any) => {
    setContentLoading(true)
    await createMovement(data)
    await fetchMovements()
    setContentLoading(false)
  }

  const handleTabChange = (tab: Tab) => {
    if (tab === 'low-stock') {
      setLowStockLoading(true)
      setTimeout(() => setLowStockLoading(false), 300)
    }
    setActiveTab(tab)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">Gestión de Stock</h1>
          <p className="text-blue-100 mt-1">Monitor y control de inventario</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white px-6">
          <nav className="flex gap-4">
            <button
              onClick={() => handleTabChange('movements')}
              className={`px-6 py-4 font-medium transition-all duration-300 relative ${
                activeTab === 'movements'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Movimientos
              {activeTab === 'movements' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => handleTabChange('low-stock')}
              className={`px-6 py-4 font-medium transition-all duration-300 relative ${
                activeTab === 'low-stock'
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Bajo Stock
              {activeTab === 'low-stock' && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600"></div>
              )}
            </button>
          </nav>
        </div>

        {/* Contenido */}
        <div className="min-h-[400px]">
          {contentLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 flex flex-col items-center shadow-xl">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
                <p className="text-gray-700">Procesando...</p>
              </div>
            </div>
          )}

          <div className="p-6">
            {activeTab === 'movements' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-4 text-gray-800">Filtros</h3>
                    <StockFilters onFilter={fetchMovements} />
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-semibold text-lg text-gray-800">Historial de Movimientos</h3>
                  </div>
                  {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center min-h-[300px]">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-gray-600">Cargando movimientos...</p>
                    </div>
                  ) : (
                    <StockMovementsTable movements={movements} />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'low-stock' && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                    Productos con Stock Bajo
                    <span className="ml-2 bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                      Alerta
                    </span>
                  </h3>
                </div>
                {lowStockLoading ? (
                  <div className="p-12 flex flex-col items-center justify-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mb-4"></div>
                    <p className="text-gray-600">Buscando productos con stock bajo...</p>
                  </div>
                ) : (
                  <LowStockTable />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Total movimientos: {movements.length}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Última actualización: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
