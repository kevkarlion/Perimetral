'use client'

import Link from 'next/link'
import { IProduct } from '@/app/components/store/product-store'

interface ProductCardProps {
  product: IProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const variacionesActivas = Array.isArray(product.variaciones)
    ? product.variaciones.filter(v => v?.activo)
    : []

  const productLink =
    variacionesActivas.length === 1
      ? `/categoria/variants/${variacionesActivas[0]._id}`
      : variacionesActivas.length > 1
      ? `/categoria/variants?productId=${product._id}`
      : `/categoria/${product._id}`

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col">
      {product.imagen ? (
        <div className="relative h-48 w-full">
          <img
            src={product.imagen}
            alt={product.nombre}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">Sin imagen</span>
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.nombre}</h3>
        {product.descripcionCorta && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-3">{product.descripcionCorta}</p>
        )}
        {product.precio !== undefined && (
          <span className="text-base font-bold text-brand mb-4">${product.precio.toLocaleString()}</span>
        )}
        {product.tieneVariaciones && (
          <span className="text-xs text-gray-400 mb-2">
            {variacionesActivas.length} variante{variacionesActivas.length !== 1 ? 's' : ''}
          </span>
        )}
        <Link
          href={productLink}
          className="mt-auto inline-block bg-brand text-white text-center py-2 px-4 rounded hover:bg-brandHover transition-colors"
        >
          Ver producto
        </Link>
      </div>
    </div>
  )
}
