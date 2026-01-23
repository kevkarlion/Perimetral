'use client'

import { useState } from "react"

interface Product {
  _id: string
  nombre: string
}

interface Props {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export default function CreateVariationModal({ product, isOpen, onClose }: Props) {
  const [codigo, setCodigo] = useState("")
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [medida, setMedida] = useState("")
  const [uMedida, setUMedida] = useState("")
  const [precio, setPrecio] = useState(0)
  const [stock, setStock] = useState(0)
  const [imagenes, setImagenes] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSave = async () => {
    if (!codigo || !nombre || precio < 0 || stock < 0 || !imagenes) {
      setError("Completa todos los campos obligatorios")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/variations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product._id,
          codigo,
          nombre,
          descripcion,
          medida,
          uMedida,
          precio,
          stock,
          imagenes: imagenes.split(",").map(i => i.trim()),
        }),
      })

      if (!res.ok) throw new Error()
      onClose()
    } catch {
      setError("Error creando variación")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[80]">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">
          Nueva variación de "{product.nombre}"
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input placeholder="Código *" value={codigo} onChange={e => setCodigo(e.target.value)} className="input" />
        <input placeholder="Nombre *" value={nombre} onChange={e => setNombre(e.target.value)} className="input" />
        <input placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="input" />
        <input placeholder="Medida" value={medida} onChange={e => setMedida(e.target.value)} className="input" />
        <input placeholder="Unidad de medida" value={uMedida} onChange={e => setUMedida(e.target.value)} className="input" />

        <input type="number" placeholder="Precio *" value={precio} onChange={e => setPrecio(+e.target.value)} className="input" />
        <input type="number" placeholder="Stock *" value={stock} onChange={e => setStock(+e.target.value)} className="input" />

        <input
          placeholder="Imágenes (urls separadas por coma) *"
          value={imagenes}
          onChange={e => setImagenes(e.target.value)}
          className="input"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} className="btn-primary" disabled={loading}>
            {loading ? "Guardando..." : "Crear"}
          </button>
        </div>
      </div>
    </div>
  )
}
