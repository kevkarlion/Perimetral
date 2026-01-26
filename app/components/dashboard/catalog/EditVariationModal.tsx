"use client"

import { useState } from "react"

interface Variation {
  _id: string
  codigo: string
  nombre: string
  precio: number
  stock: number
}

interface Props {
  variation: Variation
  isOpen: boolean
  onClose: () => void
}

export default function EditVariationModal({
  variation,
  isOpen,
  onClose,
}: Props) {
  const [precio, setPrecio] = useState(variation.precio)
  const [stock, setStock] = useState(variation.stock)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSave = async () => {
    if (precio < 0 || stock < 0) {
      setError("Precio y stock no pueden ser negativos")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/variations/${variation._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ precio, stock }),
      })

      if (!res.ok) throw new Error("Error al guardar")

      onClose()
    } catch (err) {
      setError("No se pudo guardar la variación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[80]">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Editar variación
          </h2>
          <p className="text-sm text-gray-500">
            {variation.nombre} · Cod: {variation.codigo}
          </p>
        </div>

        {error && (
          <p className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        {/* Campos */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio
            </label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(+e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(+e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  )
}
