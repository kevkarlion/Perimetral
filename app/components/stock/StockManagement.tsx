'use client'

import { useEffect } from 'react'
import { useStock } from '@/app/components/hooks/useStock'
import StockFilters from './StockFilters';
import StockMovementsTable from '@/app/components/stock/StockMovementsTable'
import StockMovementForm from '@/app/components/stock/StockMovementForm'

export default function StockManagement() {
  const { movements, loading, fetchMovements, createMovement } = useStock()

  useEffect(() => { fetchMovements() }, [])

  const handleCreate = async (data: any) => {
    await createMovement(data)
    await fetchMovements()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Gestión de Stock</h2>

      <StockFilters onFilter={fetchMovements} />
      <StockMovementForm onCreate={handleCreate} />

      {loading ? (
        <p className="text-gray-500">Cargando movimientos...</p>
      ) : (
        <StockMovementsTable movements={movements} />
      )}
    </div>
  )
}
