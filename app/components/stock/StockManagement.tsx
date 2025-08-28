'use client'

import { useEffect, useState } from 'react'
import { useStock } from '@/app/components/hooks/useStock'
import StockFilters from './StockFilters'
import StockMovementsTable from '@/app/components/stock/StockMovementsTable'
import StockMovementForm from '@/app/components/stock/StockMovementForm'
import LowStockTable from '@/app/components/stock/LowStockList'

type Tab = 'movements' | 'low-stock'

export default function StockManagement() {
  const { movements, loading, fetchMovements, createMovement } = useStock()
  const [activeTab, setActiveTab] = useState<Tab>('movements')

  useEffect(() => { 
    fetchMovements() 
  }, [])

  const handleCreate = async (data: any) => {
    await createMovement(data)
    await fetchMovements()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Gestión de Stock</h2>

      {/* Navegación por pestañas */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-4 py-2 border-b-2 ${
              activeTab === 'movements'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            Movimientos
          </button>
          <button
            onClick={() => setActiveTab('low-stock')}
            className={`px-4 py-2 border-b-2 ${
              activeTab === 'low-stock'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500'
            }`}
          >
            Bajo Stock
          </button>
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      {activeTab === 'movements' && (
        <>
          <StockFilters onFilter={fetchMovements} />
          <StockMovementForm onCreate={handleCreate} />
          
          {loading ? (
            <p className="text-gray-500">Cargando movimientos...</p>
          ) : (
            <StockMovementsTable movements={movements} />
          )}
        </>
      )}

      {activeTab === 'low-stock' && (
        <LowStockTable />
      )}
    </div>
  )
}