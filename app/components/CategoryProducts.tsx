'use client'

import { useSearchParams } from 'next/navigation'
import { useProductStore } from '@/app/components/store/product-store'
import ProductCard from '@/app/components/ProductCard'
import Link from 'next/link'
import CategoryProductsSkeleton from '@/app/components/Skeletons/CategoryProductsSkeleton'

export default function CategoryProducts() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('category') || ''

  const { products, loading, error } = useProductStore()

  // 1. LOADING
  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <CategoryProductsSkeleton />
        </div>
      </section>
    )
  }

  // 2. ERROR
  if (error) {
    return (
      <p className="text-center py-16 text-red-500">
        {error}
      </p>
    )
  }

  // 3. FILTRADO (solo cuando ya terminó de cargar)
  const filteredProducts = products.filter(p => {
    if (!p.categoria) return false
    return typeof p.categoria === 'string'
      ? p.categoria === categoryId
      : p.categoria._id === categoryId
  })

  const categoryName =
    filteredProducts[0]?.categoria?.nombre || 'Categoría'

  // 4. EMPTY STATE
  if (filteredProducts.length === 0) {
    return (
      <p className="text-center py-16 text-gray-500">
        No hay productos en esta categoría
      </p>
    )
  }

  // 5. DATA
  return (
    <section className="py-16 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="text-sm text-gray-600 mb-4 flex gap-2 items-center">
          <Link href="/" className="hover:text-brand cursor-pointer">
            Inicio
          </Link>
          <span>›</span>
          <span className="font-semibold">{categoryName}</span>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          {categoryName}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
