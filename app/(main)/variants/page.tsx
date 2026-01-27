'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { IVariationWithProduct } from '@/types/ProductFormData'
import Link from 'next/link'

// fetcher genérico
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

export default function VariantsPage() {
  const params = useSearchParams()
  const productId = params.get('productId')
  const router = useRouter()

  // 1️⃣ Fetch de variaciones
  const { data: rawVariations, error: varError, isLoading: varLoading } = useSWR<IVariationWithProduct[]>(
    productId ? `/api/variations?productId=${productId}` : null,
    fetcher
  )

  // Aseguramos que siempre sea array y que tenga product
  const variations: IVariationWithProduct[] = Array.isArray(rawVariations)
    ? rawVariations.map(v => ({
        ...v,
        product: v.product || { _id: productId || '', nombre: 'Producto' },
      }))
    : []

  // Tomamos el producto para breadcrumb
  const product = variations[0]?.product

  if (!productId) return <p className="text-red-500 mt-24 ml-6">Producto inválido</p>
  if (varLoading) return <p className="mt-24 ml-6">Cargando variaciones...</p>
  if (varError) return <p className="text-red-500 mt-24 ml-6">{varError.message}</p>
  if (variations.length === 0)
    return <p className="text-gray-500 mt-24 ml-6">No hay variaciones para este producto</p>

  return (
    <section className="mt-12 p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4 flex gap-2">
        <Link href="/" className="hover:text-brand">Inicio</Link>
        <span>›</span>
        <span className="hover:text-brand">{product?.categoria?.nombre || 'Categoría'}</span>
        <span>›</span>
        <span className="font-semibold">{product?.nombre || 'Producto'}</span>
      </nav>

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Variantes de {product?.nombre || 'Producto'}
        </h1>
        <p className="text-gray-500">Seleccioná una versión del producto</p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {variations.map(v => {
          const cover = v.imagenes?.[0] || '/no-image.png'
          const lowStock =
            v.stockMinimo !== undefined &&
            v.stock !== undefined &&
            v.stock <= v.stockMinimo

          return (
            <div
              key={v._id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden flex flex-col"
            >
              {/* Imagen */}
              <div className="relative h-52 w-full overflow-hidden">
                <img src={cover} alt={v.nombre} className="w-full h-full object-cover" />
                {v.imagenes?.length > 1 && (
                  <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    +{v.imagenes.length - 1}
                  </span>
                )}
              </div>

              {/* Contenido */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{v.nombre}</h3>
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

                {/* Stock */}
                {v.stock !== undefined && (
                  <p className={lowStock ? 'text-red-500' : 'text-green-600'}>
                    Stock: {v.stock} {lowStock && '¡Últimas unidades!'}
                  </p>
                )}

                {/* CTA */}
                <button
                  onClick={() => router.push(`/variant/${v._id}`)}
                  className="mt-auto bg-brand text-white py-2 rounded-full text-center hover:bg-brandHover transition"
                >
                  Ver detalle
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
