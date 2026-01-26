'use client'

import { useState, useEffect } from "react"
import { ICategory, useCategoryStore } from "@/app/components/store/category-store"

interface EditCategoryModalProps {
  isOpen: boolean
  category: ICategory | null
  onClose: () => void
}

export default function EditCategoryModal({ isOpen, category, onClose }: EditCategoryModalProps) {
  const [nombre, setNombre] = useState("")
  const [slug, setSlug] = useState("")
  const { updateCategory } = useCategoryStore()

  useEffect(() => {
    if (category) {
      setNombre(category.nombre)
      setSlug(category.slug || "")
    }
  }, [category])

  const handleSave = async () => {
    if (!category) return
    if (!nombre.trim()) return alert("El nombre es obligatorio")

    const payload: ICategory = {
      _id: category._id,
      nombre: nombre.trim(),
      slug: slug.trim(),
    }

    try {
      await updateCategory(payload)
      onClose()
    } catch (err) {
      console.error(err)
    }
  }

  if (!isOpen || !category) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-black">Editar Categoría</h2>

        <label className="block mb-2 font-semibold text-black">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <label className="block mb-2 font-semibold text-black">Slug</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100 text-black"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  )
}
