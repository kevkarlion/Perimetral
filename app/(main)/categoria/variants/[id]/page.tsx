'use client'

import { useParams } from 'next/navigation'
import { useProductStore, IProduct } from '@/app/components/store/product-store'

export default function VariantDetailPage() {
  const params = useParams()
  const variantId = params.id
  const { products, loading, error } = useProductStore()

  if (loading) return <p className="text-center py-8">Cargando...</p>
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>

  // Buscamos la variante en todos los productos
  let variant: any
  let product: IProduct | undefined

  for (const p of products) {
    const found = p.variaciones?.find(v => v._id === variantId)
    if (found) {
      variant = found
      product = p
      break
    }
  }

  if (!variant) return <p className="text-center py-8 text-gray-500">Variante no encontrada</p>

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-4">{product?.nombre} - {variant.nombre}</h1>

        {variant.imagen && (
          <div className="mb-6">
            <img src={variant.imagen} alt={variant.nombre} className="w-full max-w-md rounded shadow" />
          </div>
        )}

        {variant.descripcionCorta && (
          <p className="text-gray-700 mb-4">{variant.descripcionCorta}</p>
        )}

        {variant.descripcionLarga && (
          <p className="text-gray-600 mb-4">{variant.descripcionLarga}</p>
        )}

        {variant.precio !== undefined && (
          <p className="text-2xl font-bold text-brand mb-4">${variant.precio.toLocaleString()}</p>
        )}

        <button className="bg-brand text-white py-2 px-4 rounded hover:bg-brandHover transition-colors">
          Comprar
        </button>
      </div>
    </section>
  )
}
