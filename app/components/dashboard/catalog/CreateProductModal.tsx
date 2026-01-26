'use client'

import { useState } from "react"
import { ICategory } from "@/app/components/store/category-store"

interface CreateProductModalProps {
  isOpen: boolean
  category: ICategory
  onClose: () => void
}

export default function CreateProductModal({
  isOpen,
  category,
  onClose,
}: CreateProductModalProps) {
  const [codigoPrincipal, setCodigoPrincipal] = useState("")
  const [nombre, setNombre] = useState("")
  const [slug, setSlug] = useState("")
  const [descripcionCorta, setDescripcionCorta] = useState("")
  const [descripcionLarga, setDescripcionLarga] = useState("")
  const [proveedor, setProveedor] = useState("")
  const [destacado, setDestacado] = useState(false)
  const [activo, setActivo] = useState(true)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSave = async () => {
    if (!codigoPrincipal.trim() || !nombre.trim()) {
      alert("El código principal y el nombre son obligatorios")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigoPrincipal,
          nombre,
          slug,
          categoria: category._id,
          descripcionCorta,
          descripcionLarga,
          proveedor,
          destacado,
          activo,
        }),
      })

      const result = await res.json()

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Error creando producto")
      }

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-black">
          Crear producto en "{category.nombre}"
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          placeholder="Código principal *"
          value={codigoPrincipal}
          onChange={(e) => setCodigoPrincipal(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-2"
        />

        <input
          placeholder="Nombre *"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-2"
        />

        <input
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-2"
        />

        <textarea
          placeholder="Descripción corta"
          value={descripcionCorta}
          onChange={(e) => setDescripcionCorta(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-2"
        />

        <textarea
          placeholder="Descripción larga"
          value={descripcionLarga}
          onChange={(e) => setDescripcionLarga(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-2"
        />

        <input
          placeholder="Proveedor"
          value={proveedor}
          onChange={(e) => setProveedor(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 text-black">
            <input
              type="checkbox"
              checked={destacado}
              onChange={(e) => setDestacado(e.target.checked)}
            />
            Destacado
          </label>

          <label className="flex items-center gap-2 text-black">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
            />
            Activo
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-black"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {loading ? "Guardando..." : "Crear producto"}
          </button>
        </div>
      </div>
    </div>
  )
}
