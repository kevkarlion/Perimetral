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
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Categorías</h2>
        {/* Botón global para agregar nueva categoría */}
        <button
          onClick={() => setAddModalOpen(true)}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          + Agregar Nueva Categoría
        </button>
      </div>

      {loading && <p>Cargando categorías...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-1">
        {categories.map(cat => (
          <li key={cat._id} className="flex justify-between items-center border-b py-1 px-2">
            <span
              className="cursor-pointer hover:underline"
              onClick={() => onSelectCategory?.(cat._id)}
            >
              {cat.nombre}
            </span>

            <button
              onClick={() => setAdminModalOpen(cat._id)}
              className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Administrar
            </button>

            {/* Modal de administrar solo para editar / eliminar / explorar productos */}
            {adminModalOpen === cat._id && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">Administrar "{cat.nombre}"</h2>

                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        setEditModalCategory(cat)
                        setAdminModalOpen(null)
                      }}
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Editar Categoría
                    </button>

                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Eliminar Categoría
                    </button>

                    <button
                      onClick={() => {
                        setProductsModalCategory(cat)
                        setAdminModalOpen(null)
                      }}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Explorar Productos
                    </button>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setAdminModalOpen(null)}
                      className="px-4 py-2 rounded border hover:bg-gray-100"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

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
