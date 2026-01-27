'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import Image from 'next/image'
import { IVariationWithProduct } from '@/types/ProductFormData'
import VariantsSkeleton from '@/app/components/Skeletons/VariantsSkeleton'
import { useState } from 'react'
import Link from 'next/link'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  const text = await res.text()
  try {
    const data = JSON.parse(text)
    if (!data.success) throw new Error(data.error || 'Error cargando datos')
    return data.data
  } catch (e) {
    console.error('Error parseando JSON:', e)
    throw new Error(`Error cargando datos: ${text}`)
  }
}

// ----------------------
// Card individual
// ----------------------
function VariationCard({ v }: { v: IVariationWithProduct }) {
  const router = useRouter()
  const [imgIndex, setImgIndex] = useState(0)

  const images = v.imagenes && v.imagenes.length > 0 ? v.imagenes : ['/no-image.png']

  const nextImage = () => setImgIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setImgIndex((prev) => (prev - 1 + images.length) % images.length)

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden flex flex-col">
      {/* Carrusel de imágenes */}
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={images[imgIndex]}
          alt={v.nombre}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 33vw"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded-full hover:bg-black/70 transition"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded-full hover:bg-black/70 transition"
            >
              ›
            </button>
            <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              +{images.length - 1}
            </span>
          </>
        )}

        {v.destacada && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded shadow">
            Destacado
          </span>
        )}

        {v.descuento && (
          <span className="absolute top-10 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded shadow">
            {v.descuento}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{v.nombre}</h3>

        {v.atributos && v.atributos.length > 0 && (
          <ul className="text-xs text-gray-500 mb-2 space-y-1">
            {v.atributos.map((attr, i) => (
              <li key={i}>
                <span className="font-medium">{attr.nombre}:</span> {attr.valor}
              </li>
            ))}
          </ul>
        )}

        {v.descripcion && (
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{v.descripcion}</p>
        )}

        <p className="text-2xl font-bold text-gray-900 mb-2">
          ${Number(v.precio ?? 0).toLocaleString('es-AR')}
        </p>

        {v.medida && (
          <p className="text-xs text-gray-400 mb-2">
            Medida: {v.medida} {v.uMedida}
          </p>
        )}

        <button
          onClick={() => router.push(`/variant/${v._id}`)}
          className="mt-auto bg-brand text-white py-2 rounded-full text-center hover:bg-brandHover transition"
        >
          Ver detalle
        </button>
      </div>
    </div>
  )
}

// ----------------------
// Componente principal
// ----------------------
export default function VariantsPage() {
  const params = useSearchParams()
  const productId = params.get('productId')

  const { data: rawVariations, error: varError, isLoading: varLoading } = useSWR<IVariationWithProduct[]>(
    productId ? `/api/variations?productId=${productId}` : null,
    fetcher
  )

  const variations: IVariationWithProduct[] = Array.isArray(rawVariations)
    ? rawVariations.map(v => ({
        ...v,
        product: v.product || { _id: productId || '', nombre: 'Producto' },
      }))
    : []

  const product = variations[0]?.product

  if (!productId) return <p className="text-red-500 mt-24 ml-6">Producto inválido</p>
  if (varLoading) return <VariantsSkeleton />
  if (varError) return <p className="text-red-500 mt-24 ml-6">{varError.message}</p>
  if (variations.length === 0) return <p className="text-gray-500 mt-24 ml-6">No hay variaciones para este producto</p>

  return (
    <div className="mt-6 px-4 md:px-6 mb-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4 flex gap-2">
        <Link href="/" className="hover:text-brand">Inicio</Link>
        <span>›</span>
        <span className="hover:text-brand">{product?.categoria?.nombre || 'Categoría'}</span>
        <span>›</span>
        <span className="font-semibold">{product?.nombre || 'Producto'}</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Variantes de {product?.nombre || 'Producto'}
        </h1>
        <p className="text-gray-500 text-sm md:text-base">Seleccioná una versión del producto</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {variations.map(v => (
          <VariationCard key={v._id} v={v} />
        ))}
      </div>
    </div>
  )
}
