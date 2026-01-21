'use client'

import Link from "next/link"
import { useCategoryStore } from "@/app/components/store/category-store"

export default function CategoriesPageHome() {
  const { categories, loading, error } = useCategoryStore()

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 text-center">
        <p className="text-gray-500 text-lg">Cargando categorías...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50 text-center">
        <p className="text-red-500 text-lg">{error}</p>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50" id="categories">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          Nuestras <span className="text-brand">Categorías</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
            >
              {cat.imagen ? (
                <div className="relative h-48 w-full">
                  <img
                    src={cat.imagen}
                    alt={cat.nombre}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">Sin imagen</span>
                </div>
              )}

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{cat.nombre}</h3>
                {cat.descripcion && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                    {cat.descripcion}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                  <span>{cat.parentId ? "Subcategoría" : "Categoría principal"}</span>
                  {cat.createdAt && <span>{new Date(cat.createdAt).toLocaleDateString()}</span>}
                </div>
                <Link
                  href={`/categoria?category=${cat._id}`}
                  className="mt-4 inline-block bg-brand text-white text-center py-2 px-4 rounded hover:bg-brandHover transition-colors"
                >
                  Ver productos
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
