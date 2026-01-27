'use client'

import { useState } from "react"
import { useCategoryStore, ICategory } from "@/app/components/store/category-store"
import CloudinaryUploader from "@/app/components/CloudinaryUploader"

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const { categories, addCategory } = useCategoryStore()

  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [activo, setActivo] = useState(true)
  const [parentId, setParentId] = useState<string | null>(null)
  const [imagen, setImagen] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!nombre.trim()) {
      setError("El nombre es obligatorio")
      return
    }

    setLoading(true)
    setError(null)

    const payload: ICategory = {
      _id: "",
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined,
      activo,
      parentId: parentId || undefined,
      imagen: imagen || undefined, // agregamos la imagen
    }

    try {
      await addCategory(payload)
      // limpiar campos y cerrar modal
      setNombre("")
      setDescripcion("")
      setActivo(true)
      setParentId(null)
      setImagen(null)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50">
  <div className="bg-white rounded-lg p-6 w-full max-w-md overflow-y-auto max-h-[80vh] shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black">Agregar Nueva Categoría</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <label className="block mb-2 font-semibold text-black">Nombre *</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2 font-semibold text-black">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2 font-semibold text-black">Categoría Padre</label>
        <select
          value={parentId || ""}
          onChange={(e) => setParentId(e.target.value || null)}
          className="w-full border rounded px-3 py-2 mb-4"
        >
          <option value="">-- Ninguna --</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>{c.nombre}</option>
          ))}
        </select>

        <label className="flex items-center mb-4 space-x-2 text-black">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
          />
          <span>Activo</span>
        </label>

        {/* CLOUDINARY UPLOADER */}
        <label className="block mb-2 font-semibold text-black">Imagen de Categoría</label>
        <CloudinaryUploader
          existingImages={imagen ? [imagen] : []}
          onImageUpload={(url) => setImagen(url)}
          folder="categories"
        />
        {imagen && (
          <div className="mt-2 relative w-32 h-32">
            <img src={imagen} alt="Categoría" className="w-full h-full object-cover rounded border" />
            <button
              type="button"
              onClick={() => setImagen(null)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-80 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100 text-black"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  )
}
