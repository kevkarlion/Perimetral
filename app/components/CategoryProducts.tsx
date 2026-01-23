'use client'

import { useProductStore } from "@/app/components/store/product-store"
import ProductCard from "@/app/components/ProductCard"

interface CategoryProductsProps {
  categoryId: string
}

export default function CategoryProducts({ categoryId }: CategoryProductsProps) {
  const { products, loading, error } = useProductStore()

  if (loading) return <p className="text-center py-8">Cargando productos...</p>
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>

  const filteredProducts = products.filter(p => {
  if (!p.categoria) return false;

  if (typeof p.categoria === "string") {
    return p.categoria === categoryId;
  }

  return p.categoria._id === categoryId;
});



  
  console.log('categoryId:', categoryId)
console.log('products:', products)
  if (filteredProducts.length === 0) {
    return <p className="text-center py-8 text-gray-500">No hay productos en esta categoría</p>
  }



  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Productos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
