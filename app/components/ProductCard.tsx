'use client'

import Link from 'next/link'
import { IProduct } from '@/app/components/store/product-store'

interface ProductCardProps {
  product: IProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      <div className="relative h-48 w-full">
        <img
          src={product.imagen || "/no-image.png"}
          alt={product.nombre}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold">{product.nombre}</h3>

        {product.descripcionCorta && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-3">
            {product.descripcionCorta}
          </p>
        )}

        {product.variationsCount > 0 && (
          <span className="text-xs text-gray-400 mb-2">
            {product.variationsCount} variante
            {product.variationsCount !== 1 ? "s" : ""}
          </span>
        )}

        <Link
          href={`/variants?productId=${product._id}`}
          className="mt-auto bg-brand text-white py-2 rounded text-center"
        >
          Ver producto
        </Link>
      </div>
    </div>
  )
}
