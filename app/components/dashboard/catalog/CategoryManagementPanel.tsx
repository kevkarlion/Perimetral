'use client'

import { useState, useEffect } from "react"
import { ICategory, useCategoryStore } from "@/app/components/store/category-store"
import EditCategoryModal from "./EditCategoryModal"
import AddCategoryModal from "./AddCategoryModal"
import CategoryProductsModal from "./CategoryProductsModal"

interface CategoryManagementPanelProps {
  onSelectCategory?: (id: string) => void
}

export default function CategoryManagementPanel({ onSelectCategory }: CategoryManagementPanelProps) {
  const {
    categories,
    loading,
    error,
    initialized,
    refreshCategories,
    deleteCategory,
  } = useCategoryStore()

  const [adminModalOpen, setAdminModalOpen] = useState<string | null>(null)
  const [editModalCategory, setEditModalCategory] = useState<ICategory | null>(null)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [productsModalCategory, setProductsModalCategory] = useState<ICategory | null>(null)

  useEffect(() => {
    if (!initialized) refreshCategories()
  }, [initialized, refreshCategories])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que querés eliminar esta categoría?")) return
    await deleteCategory(id)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Categorías</h2>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2 rounded-full text-sm bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition"
        >
          + Nueva categoría
        </button>
      </div>

      {loading && <p className="text-white/50">Cargando categorías…</p>}
      {error && <p className="text-red-400">{error}</p>}

      {/* Lista */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        {categories.map(cat => (
          <div
            key={cat._id}
            className="flex items-center justify-between px-4 py-3 border-b border-white/5 hover:bg-white/5 transition"
          >
            <span
              className="text-white cursor-pointer hover:text-indigo-300 transition"
              onClick={() => onSelectCategory?.(cat._id)}
            >
              {cat.nombre}
            </span>

            <button
              onClick={() => setAdminModalOpen(cat._id)}
              className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition"
            >
              Administrar
            </button>

            {/* Modal administrador */}
            {adminModalOpen === cat._id && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-[#0f0f14] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
                  <h3 className="text-lg font-semibold text-white">
                    {cat.nombre}
                  </h3>

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setEditModalCategory(cat)
                        setAdminModalOpen(null)
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
                    >
                      Editar categoría
                    </button>

                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="w-full px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
                    >
                      Eliminar categoría
                    </button>

                    <button
                      onClick={() => {
                        setProductsModalCategory(cat)
                        setAdminModalOpen(null)
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition"
                    >
                      Ver productos
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setAdminModalOpen(null)}
                      className="text-sm text-white/50 hover:text-white transition"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modales */}
      <AddCategoryModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      <EditCategoryModal
        isOpen={!!editModalCategory}
        category={editModalCategory}
        onClose={() => setEditModalCategory(null)}
      />

      <CategoryProductsModal
        isOpen={!!productsModalCategory}
        category={productsModalCategory}
        onClose={() => setProductsModalCategory(null)}
      />
    </div>
  )
}
