import ProductCard from "./ProductCardMain"
import { useProductStore } from "@/app/components/store/product-store"

export default function ProductGrid() {
  const { products } = useProductStore()
  console.log('Renderizando ProductGrid con productos:', products)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
     
      {products.map((product) => (
        <ProductCard
          key={product._id.toString()}
          product={product}
        />
      ))}
    </div>
  )
}