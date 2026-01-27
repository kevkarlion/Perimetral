'use client'

import Link from 'next/link'
import { IProduct } from '@/app/components/store/product-store'

interface ProductCardProps {
  product: IProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const cover = product.imagenes?.[0] || '/no-image.png'

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition">

      {/* IMAGEN */}
      <div className="relative w-full h-52 bg-gray-100">
        <img
          src={cover}
          alt={product.nombre}
          className="w-full h-full object-cover"
        />

        {/* BADGE DE CANTIDAD */}
        {product.imagenes && product.imagenes.length > 1 && (
          <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            +{product.imagenes.length - 1}
          </span>
        )}

        {/* BADGE DESTACADO */}
        {product.destacado && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded">
            Destacado
          </span>
        )}
      </div>

      {/* CUERPO */}
      <div className="p-4 flex flex-col flex-grow">

        {/* CATEGORÍA */}
        {product.categoria?.nombre && (
          <span className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            {product.categoria.nombre}
          </span>
        )}

        {/* NOMBRE */}
        <h3 className="text-base font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">
          {product.nombre}
        </h3>

        {/* CÓDIGO */}
        <span className="text-xs text-gray-500 mb-2">
          Código: <span className="font-medium">{product.codigoPrincipal}</span>
        </span>

        {/* DESCRIPCIÓN */}
        {product.descripcionCorta && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.descripcionCorta}
          </p>
        )}

        {/* VARIANTES */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>
            {product.variationsCount > 0
              ? `${product.variationsCount} variante${product.variationsCount !== 1 ? 's' : ''}`
              : 'Sin variaciones'}
          </span>

          {/* ESTADO */}
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

        {/* CTA */}
        <Link
          href={`/variants?productId=${product._id}`}
          className="mt-auto w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded"
        >
          Ver producto
        </Link>
      </div>
    </div>
  )
}
