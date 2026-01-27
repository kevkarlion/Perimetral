'use client'

import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface ICategory {
  _id: string
  nombre: string
  descripcion?: string
  imagen?: string
  parentId?: string
  createdAt?: string
}

export default function CategoriesPageHome() {
  const { data, error, isLoading } = useSWR<{ success: boolean; data: ICategory[] }>(
    "/api/categories",
    fetcher
  )

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50 text-center">
        <p className="text-gray-500 text-lg">Cargando categorías...</p>
      </section>
    )
  }

  if (error || !data?.success) {
    return (
      <section className="py-20 bg-gray-50 text-center">
        <p className="text-red-500 text-lg">{error?.message || "Error cargando categorías"}</p>
      </section>
    )
  }

  const categories = data.data || []

  return (
    <section className="py-20 bg-gray-50" id="categories">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
          Explorá nuestras <span className="text-brand">Categorías</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {categories.map((cat) => (
            <article
              key={cat._id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Imagen */}
              <div className="relative h-56 w-full overflow-hidden">
                {cat.imagen ? (
                  <img
                    src={cat.imagen}
                    alt={cat.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Sin imagen</span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-90" />

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg leading-tight">{cat.nombre}</h3>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-5 flex flex-col flex-grow">
                {cat.descripcion && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{cat.descripcion}</p>
                )}

                <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                  <span>{cat.parentId ? "Subcategoría" : "Categoría principal"}</span>
                  {cat.createdAt && <span>{new Date(cat.createdAt).toLocaleDateString()}</span>}
                </div>

                <Link
                  href={`/categoria?category=${cat._id}`}
                  className="mt-5 inline-block w-full text-center bg-brand text-white py-2.5 rounded-full font-medium hover:bg-brandHover transition-colors"
                >
                  Ver productos
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
