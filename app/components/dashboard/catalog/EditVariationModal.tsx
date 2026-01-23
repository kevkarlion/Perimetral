'use client'

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

export default function EditVariationModal({ variation, isOpen, onClose }: Props) {
  const [precio, setPrecio] = useState(variation.precio)
  const [stock, setStock] = useState(variation.stock)
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSave = async () => {
    setLoading(true)
    await fetch(`/api/variations/${variation._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ precio, stock }),
    })
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[80]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-3">
          Editar "{variation.nombre}"
        </h2>

        <input type="number" value={precio} onChange={e => setPrecio(+e.target.value)} className="input" />
        <input type="number" value={stock} onChange={e => setStock(+e.target.value)} className="input" />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} className="btn-primary">
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  )
}
