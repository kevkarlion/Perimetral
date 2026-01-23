'use client'

import { useState, useEffect } from "react"
import { useCategoryStore, ICategory } from "@/app/components/store/category-store"

interface CategoryAdminPanelProps {
  onSelectCategory?: (id: string) => void
}

export default function CategoryAdminPanel({ onSelectCategory }: CategoryAdminPanelProps) {
  const {
    categories,
    loading,
    error,
    initialized,
    refreshCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategoryStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ICategory | null>(null)
  const [nombre, setNombre] = useState("")
  const [slug, setSlug] = useState("")

  useEffect(() => {
    if (!initialized) refreshCategories()
  }, [initialized, refreshCategories])

  const openAddModal = () => {
    setEditingCategory(null)
    setNombre("")
    setSlug("")
    setModalOpen(true)
  }

  const openEditModal = (cat: ICategory) => {
    setEditingCategory(cat)
    setNombre(cat.nombre)
    setSlug(cat.slug || "")
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!nombre.trim()) return alert("El nombre es obligatorio")
    const payload: ICategory = {
      _id: editingCategory?._id || "",
      nombre: nombre.trim(),
      slug: slug.trim(),
    }

    try {
      if (editingCategory) {
        await updateCategory(payload)
      } else {
        await addCategory(payload)
      }
      setModalOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que querés eliminar esta categoría?")) return
    await deleteCategory(id)
  }

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Categorías</h2>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          + Agregar
        </button>
      </div>

      {loading && <p>Cargando categorías...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-1">
        {categories.map(cat => (
          <li
            key={cat._id}
            className="flex justify-between items-center cursor-pointer hover:underline"
          >
            <span
              onClick={() => onSelectCategory?.(cat._id)}
            >
              {cat.nombre}
            </span>
            <div className="space-x-1">
              <button
                onClick={() => openEditModal(cat)}
                className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(cat._id)}
                className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
            </h2>

            <label className="block mb-2 font-semibold">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <label className="block mb-2 font-semibold">Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded border hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
