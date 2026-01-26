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
    <div className="mb-6 p-4 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-bold text-blackCharcoal">Categorías</h2>
        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium shadow-sm"
        >
          + Agregar
        </button>
      </div>

      {loading && <p className="text-gray-500 italic">Cargando categorías...</p>}
      {error && <p className="text-red-500 font-medium">Error: {error}</p>}

      <ul className="divide-y divide-gray-100">
        {categories.map(cat => (
          <li
            key={cat._id}
            className="flex justify-between items-center py-2 hover:bg-gray-50 px-2 rounded-md group"
          >
            <span
              onClick={() => onSelectCategory?.(cat._id)}
              className="cursor-pointer text-gray-900 font-medium hover:text-brand transition-colors"
            >
              {cat.nombre}
            </span>
            <div className="space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => openEditModal(cat)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 shadow-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(cat._id)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 shadow-sm"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-black">
              {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
            </h2>

            <div className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Nombre de la categoría
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Electrónica"
                  className="
                    w-full
                    bg-white
                    text-gray-900
                    rounded-lg
                    px-4
                    py-2
                    border
                    border-gray-400
                    shadow-sm
                    hover:border-gray-500
                    focus:border-brand
                    focus:ring-2
                    focus:ring-brand/30
                    focus:shadow-md
                    outline-none
                    transition-all
                    placeholder:text-gray-400
                  "
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block mb-1 text-sm font-bold text-gray-700">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ej-electronica"
                  className="
                    w-full
                    bg-white
                    text-gray-900
                    rounded-lg
                    px-4
                    py-2
                    border
                    border-gray-400
                    shadow-sm
                    hover:border-gray-500
                    focus:border-brand
                    focus:ring-2
                    focus:ring-brand/30
                    focus:shadow-md
                    outline-none
                    transition-all
                    placeholder:text-gray-400
                  "
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2 rounded-lg border-2 border-gray-200 hover:bg-gray-50 text-black font-semibold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg bg-brand hover:bg-brandHover text-white font-semibold shadow-md transition-all active:scale-95"
              >
                {editingCategory ? "Actualizar" : "Crear Categoría"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
