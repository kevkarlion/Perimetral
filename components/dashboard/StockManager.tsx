'use client'

import { useState } from 'react'
import { IProduct, IVariation } from '@/lib/types/productTypes'

interface StockManagerProps {
  product: IProduct
  onStockUpdated: () => void
}

export default function StockManager({ product, onStockUpdated }: StockManagerProps) {
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null)
  const [stockAction, setStockAction] = useState<'set' | 'increment'>('increment')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStockUpdate = async () => {
    if (!amount || isNaN(Number(amount))) {
      setError('Ingrese una cantidad válida')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/stock?action=update-stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          variationId: selectedVariation,
          stock: Number(amount),
          action: stockAction
        })
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      const result = await response.json()
      if (!result.success) {
        throw new Error(result.error || 'Error al actualizar stock')
      }

      onStockUpdated()
      setAmount('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold text-lg mb-4">Gestión de Stock</h3>
      
      {product.tieneVariaciones && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleccionar variación
          </label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={selectedVariation || ''}
            onChange={(e) => setSelectedVariation(e.target.value || null)}
          >
            <option value="">Seleccione una variación</option>
            {product.variaciones?.map((v) => (
              <option key={v._id} value={v._id}>
                {v.medida} (Stock actual: {v.stock})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Acción
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              checked={stockAction === 'increment'}
              onChange={() => setStockAction('increment')}
              className="mr-2"
            />
            <span>Ajustar (+/-)</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={stockAction === 'set'}
              onChange={() => setStockAction('set')}
              className="mr-2"
            />
            <span>Establecer valor</span>
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {stockAction === 'increment' ? 'Cantidad a ajustar' : 'Nuevo stock'}
        </label>
        <input
          type="number"
          className="border border-gray-300 rounded px-3 py-2 w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={stockAction === 'increment' ? 'Ej: 5 o -3' : 'Ej: 25'}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}

      <button
        onClick={handleStockUpdate}
        disabled={isLoading || (product.tieneVariaciones && !selectedVariation) || !amount}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? 'Actualizando...' : 'Actualizar stock'}
      </button>

      {!product.tieneVariaciones && (
        <div className="mt-4 text-sm text-gray-500">
          Stock actual: {product.stock}
        </div>
      )}
    </div>
  )
}