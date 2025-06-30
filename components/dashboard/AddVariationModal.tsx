'use client'

import { useState } from 'react'

type Variation = {
  medida: string
  precio: string
}

type Props = {
  onClose: () => void
  initialVariations: Variation[]
  onUpdateVariations: (variaciones: Variation[]) => void
}

export default function AddVariationModal({ onClose, initialVariations, onUpdateVariations }: Props) {
  const [variation, setVariation] = useState<Variation>({ medida: '', precio: '' })
  const [variations, setVariations] = useState<Variation[]>(initialVariations)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setVariation({ ...variation, [name]: value })
  }

  const addVariation = () => {
    if (!variation.medida.trim() || !variation.precio.trim()) {
      alert('Por favor completa ambos campos.')
      return
    }

    // Evitar duplicados por medida
    if (variations.some(v => v.medida === variation.medida)) {
      alert('Ya existe una variación con esa medida.')
      return
    }

    setVariations([...variations, variation])
    setVariation({ medida: '', precio: '' })
  }

  const removeVariation = (index: number) => {
    const updated = [...variations]
    updated.splice(index, 1)
    setVariations(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateVariations(variations)
    onClose()
  }

  const labelClass = "block font-semibold text-gray-700"
  const inputClass = "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[600px] max-w-full p-6">
        <h2 className="text-xl font-bold mb-4">Editar variaciones</h2>

        <form onSubmit={handleSubmit}>
          {/* Campos de nueva variación */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="medida" className={labelClass}>Medida</label>
              <input
                id="medida"
                name="medida"
                type="text"
                placeholder="Ej: 2m"
                className={inputClass}
                value={variation.medida}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="precio" className={labelClass}>Precio</label>
              <input
                id="precio"
                name="precio"
                type="text"
                placeholder="Ej: $1200"
                className={inputClass}
                value={variation.precio}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-6">
            <button
              type="button"
              onClick={addVariation}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Agregar variación
            </button>
          </div>

          {/* Lista de variaciones */}
          <div className="space-y-2 mb-6">
            {variations.map((v, index) => (
              <div
                key={index}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span>{v.medida} - ${v.precio}</span>
                <button
                  type="button"
                  onClick={() => removeVariation(index)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Eliminar
                </button>
              </div>
            ))}
            {variations.length === 0 && <p className="text-sm text-gray-500">No hay variaciones aún.</p>}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
