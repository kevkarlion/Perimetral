'use client'

import { useEffect, useState } from "react"
import CreateVariationModal from "./CreateVariationModal"
import EditVariationModal from "./EditVariationModal"

interface Product {
  _id: string
  nombre: string
    variationsCount?: number; // 👈 NUEVO
}

interface Variation {
  _id: string
  codigo: string
  nombre: string
  precio: number
  stock: number
  activo: boolean
}

interface Props {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function ProductVariationsModal({
  product,
  isOpen,
  onClose,
}: Props) {
  const [variations, setVariations] = useState<Variation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editVariation, setEditVariation] = useState<Variation | null>(null)

  const fetchVariations = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/products/${product._id}/variations`)
      if (!res.ok) throw new Error()
      const json = await res.json()
      setVariations(json.data)
    } catch {
      setError("Error al cargar variaciones")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) fetchVariations()
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-3 text-black">
          Variaciones de "{product.nombre}"
        </h2>

        <button
          onClick={() => setCreateOpen(true)}
          className="mb-3 px-4 py-2 bg-green-600 text-white rounded"
        >
          + Crear variación
        </button>

        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <ul className="space-y-2 max-h-96 overflow-y-auto border-t pt-3 text-black">
          {variations.map((v) => (
            <li
              key={v._id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{v.nombre}</p>
                <p className="text-xs text-gray-500">
                  Cod: {v.codigo} — Stock: {v.stock}
                </p>
              </div>

              <div className="flex gap-2">
                <span className="font-semibold">${v.precio}</span>

                <button
                  onClick={() => setEditVariation(v)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Editar
                </button>

                <button
                  onClick={async () => {
                    if (!confirm("¿Desactivar esta variación?")) return
                    await fetch(`/api/variations/${v._id}`, {
                      method: "DELETE",
                    })
                    fetchVariations()
                  }}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Desactivar
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-black"
          >
            Cerrar
          </button>
        </div>

        {createOpen && (
          <CreateVariationModal
            product={product}
            isOpen={createOpen}
            onClose={() => {
              setCreateOpen(false)
              fetchVariations()
            }}
          />
        )}

        {editVariation && (
          <EditVariationModal
            variation={editVariation}
            isOpen={true}
            onClose={() => {
              setEditVariation(null)
              fetchVariations()
            }}
          />
        )}
      </div>
    </div>
  )
}
