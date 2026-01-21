'use client'

import { useProductStore } from "@/app/components/store/product-store"
import ProductCard from "@/app/components/ProductCard"

export default function CatalogoPage() {
  const { products, loading, error } = useProductStore()

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 text-center">
        <p className="text-gray-500 text-lg">Cargando productos...</p>
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
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
