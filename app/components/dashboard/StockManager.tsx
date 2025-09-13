'use client'

import { Types } from 'mongoose'
import { useState } from 'react'
import { IProduct, IVariation } from '@/types/productTypes'

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



  function isCategoryObject(
  categoria: unknown
): categoria is { _id: Types.ObjectId | string; nombre: string } {
  return (
    typeof categoria === "object" &&
    categoria !== null &&
    "nombre" in categoria
  );
}

  // Obtener información de la categoría
  const categoryName = product.categoria && isCategoryObject(product.categoria)
    ? product.categoria.nombre
    : '';

  // Obtener la variación seleccionada completa
  const getSelectedVariation = (): IVariation | null => {
    if (!selectedVariation || !product.variaciones) return null;
    return product.variaciones.find(v => v._id?.toString() === selectedVariation) || null;
  };

const handleStockUpdate = async () => {
  if (!amount || isNaN(Number(amount))) {
    setError('Ingrese una cantidad válida')
    return
  }

  setIsLoading(true)
  setError('')

  try {
    // Obtener información de la variación seleccionada
    const variation = getSelectedVariation();
    const currentStock = variation ? variation.stock : product.stock || 0;
    
    // Determinar la acción final
    let finalAction: 'set' | 'increment' | 'decrement' = 'set';
    let finalAmount = Number(amount);
    
    if (stockAction === 'increment') {
      finalAction = finalAmount >= 0 ? 'increment' : 'decrement';
      finalAmount = Math.abs(finalAmount);
    }

    // Preparar los datos para enviar
    const requestData: any = {
      productId: product._id,
      stock: finalAmount,
      action: finalAction,
      productName: product.nombre,
      productCode: product.codigoPrincipal,
      categoryName: categoryName,
      // ✅ Incluir el stock actual para referencia
      currentStock: currentStock,
    };

    // ✅ Añadir información de la variación si existe
    if (variation) {
      requestData.variationId = variation._id?.toString();
      requestData.variationName = variation.nombre || '';
      requestData.variationCode = variation.codigo || '';
    }

    console.log('Enviando datos de stock update:', requestData);

    const response = await fetch(`/api/stock?action=update-stock`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    const result = await response.json()
    if (!result.success) {
      throw new Error(result.error || 'Error al actualizar stock')
    }

    // ✅ LLAMAR A onStockUpdated PARA CERRAR EL MODAL Y ACTUALIZAR LA UI
    onStockUpdated()
    
    // ✅ LIMPIAR EL FORMULARIO
    setAmount('')
    setSelectedVariation(null)
    
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
              <option key={v._id?.toString()} value={v._id?.toString()}>
                {v.nombre || v.medida} - Stock: {v.stock} - Código: {v.codigo}
              </option>
            ))}
          </select>
          
          {/* Mostrar información adicional de la variación seleccionada */}
          {getSelectedVariation() && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
              <p><strong>Variación:</strong> {getSelectedVariation()?.nombre}</p>
              <p><strong>Código:</strong> {getSelectedVariation()?.codigo}</p>
              <p><strong>Stock actual:</strong> {getSelectedVariation()?.stock}</p>
            </div>
          )}
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
          placeholder={stockAction === 'increment' ? 'Ej: 5 (sumar) o -3 (restar)' : 'Ej: 25'}
        />
        {stockAction === 'increment' && (
          <p className="text-xs text-gray-500 mt-1">
            Use números positivos para sumar, negativos para restar
          </p>
        )}
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
    </div>
  )
}