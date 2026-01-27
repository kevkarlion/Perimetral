'use client'

import useSWR from 'swr'
import Link from 'next/link'
import CategoryProductsSkeleton from '@/app/components/Skeletons/CategoryProductsSkeleton'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function CatalogoPage() {
  const { data, error, isLoading } = useSWR('/api/products', fetcher)

  // Asegurarnos de que products sea un array
  const products = Array.isArray(data?.data) ? data.data : []

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <CategoryProductsSkeleton />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50 text-center">
        <p className="text-red-500 text-lg">Error al cargar los productos</p>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gray-50 text-center">
        <p className="text-gray-500 text-lg">No hay productos disponibles</p>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Catálogo de productos
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <div
              key={product._id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition"
            >
              {/* IMAGEN */}
              <div className="relative w-full h-52 bg-gray-100">
                <img
                  src={product.imagenes?.[0] || '/no-image.png'}
                  alt={product.nombre}
                  className="w-full h-full object-cover"
                />

                {product.imagenes?.length > 1 && (
                  <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    +{product.imagenes.length - 1}
                  </span>
                )}

                {product.destacado && (
                  <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded">
                    Destacado
                  </span>
                )}
              </div>

              {/* CUERPO */}
              <div className="p-4 flex flex-col flex-grow">
                {product.categoria?.nombre && (
                  <span className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    {product.categoria.nombre}
                  </span>
                )}

                <h3 className="text-base font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">
                  {product.nombre}
                </h3>

                {product.descripcionCorta && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.descripcionCorta}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>
                    {product.variationsCount > 0
                      ? `${product.variationsCount} variante${product.variationsCount !== 1 ? 's' : ''}`
                      : 'Sin variaciones'}
                  </span>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      product.activo
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                <Link
                  href={`/variants?productId=${product._id}`}
                  className="mt-auto w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded"
                >
                  Ver variantes
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
