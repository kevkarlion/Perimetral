'use client'

import { useState } from 'react'
import type { IVariation } from '@/lib/types/productTypes'
import { number } from 'framer-motion'

type Props = {
  productId: string
  onClose: () => void
  initialVariations: IVariation[]
  onUpdateVariations: (variaciones: IVariation[]) => Promise<void>
}

export default function AddVariationModal({ 
  productId, 
  onClose, 
  initialVariations, 
  onUpdateVariations 
}: Props) {
  const [variation, setVariation] = useState<IVariation>({ 
    medida: '', 
    precio: '',
    stock: 0
  })
  const [variations, setVariations] = useState<IVariation[]>(initialVariations)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setVariation(prev => ({ ...prev, [name]: value }))
  }

  const addVariation = () => {
    // Validación mejorada
    if (!variation.medida?.trim() || !variation.precio?.trim()) {
      setError('Por favor completa ambos campos.')
      return
    }

    // Validación de medida duplicada
    if (variations.some(v => v.medida === variation.medida.trim())) {
      setError('Ya existe una variación con esa medida.')
      return
    }

    // Validación de formato de precio
    if (isNaN(Number(variation.precio))) {
      setError('El precio debe ser un número válido.')
      return
    }

    // Crear nueva variación con valores limpios
    const newVariation: IVariation = {
      medida: variation.medida.trim(),
      precio: variation.precio.trim(),
      stock: variation.stock || 0 // Aseguramos que stock sea un número
    }

    setVariations(prev => [...prev, newVariation])
    setVariation({ medida: '', precio: '', stock: 0 })
    setError('')
  }

  const removeVariation = (index: number) => {
    setVariations(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación final antes de enviar
    if (variations.length === 0) {
      setError('Debes agregar al menos una variación.')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      await onUpdateVariations(variations)
      onClose()
    } catch (err) {
      setError('Error al guardar las variaciones. Por favor intenta nuevamente.')
      console.error('Error al guardar:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const labelClass = "block font-semibold text-gray-700 mb-1"
  const inputClass = "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold">Editar variaciones</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Campos de nueva variación */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="medida" className={labelClass}>Medida*</label>
              <input
                id="medida"
                name="medida"
                type="text"
                placeholder="Ej: 2m"
                className={inputClass}
                value={variation.medida}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="precio" className={labelClass}>Precio*</label>
              <input
                id="precio"
                name="precio"
                type="text"
                placeholder="Ej: 1200"
                className={inputClass}
                value={variation.precio}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="mb-6">
            <button
              type="button"
              onClick={addVariation}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading || !variation.medida.trim() || !variation.precio.trim()}
            >
              Agregar variación
            </button>
          </div>

          {/* Lista de variaciones */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Variaciones actuales</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
              {variations.length > 0 ? (
                variations.map((v, index) => (
                  <div
                    key={`${v.medida}-${index}`}
                    className="flex justify-between items-center border-b pb-2 last:border-b-0"
                  >
                    <div>
                      <span className="font-medium">{v.medida}</span> - ${v.precio}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariation(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={isLoading}
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm py-2">No hay variaciones agregadas</p>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              disabled={isLoading || variations.length === 0}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              ) : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}