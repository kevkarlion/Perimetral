// components/products/ProductGrid.tsx
import { IProduct } from "@/lib/types/productTypes"
import ProductCard from "./ProductCardMain"

interface ProductGridProps {
  products: IProduct[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
        />
      ))}
    </div>
  )
}