import ProductCard from "./ProductCardMain"
import { IProductBase } from "@/types/productTypes"

interface ProductGridProps {
  products: IProductBase[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
  <ProductCard
    key={product._id.toString()} // 🔑 convertir ObjectId a string
    product={product}
  />
))}

    </div>
  )
}
