'use client'

import { useProductStore } from "@/app/components/store/product-store"
import ProductCard from "@/app/components/ProductCard"
import Link from "next/link"

interface CategoryProductsProps {
  categoryId: string
}

export default function CategoryProducts({ categoryId }: CategoryProductsProps) {
  const { products, loading, error } = useProductStore()

  if (loading) return <p className="text-center py-8">Cargando productos...</p>
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>

  // Filtrar productos de la categoría
  const filteredProducts = products.filter(p => {
    if (!p.categoria) return false;
    if (typeof p.categoria === "string") return p.categoria === categoryId;
    return p.categoria._id === categoryId;
  });

  // Obtener nombre de la categoría desde los productos disponibles
  const categoryName =
    products.find(p => {
      if (!p.categoria) return false;
      if (typeof p.categoria === "string") return p.categoria === categoryId;
      return p.categoria._id === categoryId;
    })?.categoria?.nombre || "Categoría";

  if (filteredProducts.length === 0) {
    return <p className="text-center py-8 text-gray-500">No hay productos en esta categoría</p>
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* ===== BREADCRUMB ===== */}
        <div className="text-sm text-gray-600 mb-4 flex gap-2 items-center">
          <Link href="/" className="hover:text-brand cursor-pointer">Inicio</Link>
          <span>›</span>
          <span className="font-semibold">{categoryName}</span>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">{categoryName}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
