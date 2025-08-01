'use client'

import { Star, Check, ArrowLeft, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import Slider from 'react-slick'
import Image from 'next/image'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useRouter, useSearchParams } from 'next/navigation'
import { useProductStore } from '@/app/components/store/product-store'
import { IProduct } from '@/types/productTypes'
import { SkeletonVariantPage } from '@/app/components/VariantPage/SkeletonVariantPage'
import Link from 'next/link'

const CustomArrow = ({ direction, onClick }: { direction: 'next' | 'prev', onClick?: () => void }) => {
  const Icon = direction === 'next' ? ChevronRight : ChevronLeft
  return (
    <button
      type="button"
      className={`absolute top-1/2 -translate-y-1/2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 focus:outline-none ${
        direction === 'next' ? 'right-1' : 'left-1'
      }`}
      onClick={onClick}
      aria-label={`${direction === 'next' ? 'Next' : 'Previous'} image`}
    >
      <div className="bg-brand hover:bg-brandHover rounded-full p-1 transition-colors shadow-md">
        <Icon className="h-4 w-4 text-white" />
      </div>
    </button>
  )
}

export default function VariantPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { products, loading, error } = useProductStore()

  const productId = searchParams.get('productId')
  const productName = searchParams.get('productName')
  const product = products.find(p => p._id === productId)

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomArrow direction="next" />,
    prevArrow: <CustomArrow direction="prev" />,
    adaptiveHeight: true,
    autoplay: false,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }
if (loading) {
  return <SkeletonVariantPage productName={productName} />
}

  if (error || !product) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Error al cargar el producto</h1>
          <p className="text-md md:text-lg text-gray-600 max-w-3xl mx-auto">
            {error || 'El producto solicitado no existe'}
          </p>
          <button
            onClick={() => router.back()}
            className="flex items-center text-brand font-bold hover:text-brandHover transition-colors mt-4 mx-auto"
          >
            <ArrowLeft size={16} className="mr-2" />
            Volver al catálogo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <button
        onClick={() => router.back()}
        className="flex items-center text-brand font-bold hover:text-brandHover transition-colors mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Volver al catálogo
      </button>

      {/* Sección de variantes */}
      {product.tieneVariaciones && product.variaciones.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            Variantes de {productName || product.nombre}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {product.variaciones.map((variante) => (
              <div 
                key={variante._id} 
                className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 bg-white flex flex-col h-full"
              >
                <div className="relative h-48 bg-gray-100">
                  {product.imagenesGenerales?.[0] ? (
                    <Link 
                      href={{
                        pathname: `/catalogo/variants/${variante._id}`,
                        query: { 
                          productId: productId,
                          productName: productName || product.nombre
                        }
                      }}
                      className="block h-full w-full"
                    >
                      <Image
                        src={product.imagenesGenerales[0]}
                        alt={`${product.nombre} - ${variante.medida}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </Link>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      Imagen no disponible
                    </div>
                  )}
                </div>

                <div className="p-3 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <Link 
                      href={{
                        pathname: `/catalogo/variants/${variante._id}`,
                        query: { 
                          productId: productId,
                          productName: productName || product.nombre
                        }
                      }}
                      className="group-hover:text-brandHover transition-colors flex-grow"
                    >
                      <h3 className="text-sm font-semibold text-gray-900">
                        {product.nombre} 
                      </h3>
                    </Link>
                  </div>

                  <div className="mb-2">
                    <h4 className="text-xs text-gray-500 mb-1">Medida</h4>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {variante.medida}
                    </span>
                  </div>

                  {variante.precio && (
                    <div className="flex flex-col mt-2">
                      <span className="text-xs text-gray-500">Precio</span>
                      <span className="text-lg font-bold text-brand mt-1">
                        {formatPrice(variante.precio)}
                      </span>
                    </div>
                  )}

                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <Link
                      href={{
                        pathname: `/catalogo/variants/${variante._id}`,
                        query: { 
                          productId: productId,
                          productName: productName || product.nombre
                        }
                      }}
                      className="flex items-center text-xs font-medium text-brand hover:text-brandHover transition-colors group"
                    >
                      <span>Comprar</span>
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de contacto */}
      <div className="mt-8 bg-gradient-to-r from-brand to-brand-dark p-0.5 rounded-lg shadow-md">
        <div className="bg-white rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">¿Necesitas más información?</h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto text-sm">
            Nuestros especialistas están disponibles para responder todas tus consultas.
          </p>
          <a
            href={`https://wa.me/5492984392148?text=Hola,%20me%20interesa%20el%20producto:%20${encodeURIComponent(product.nombre)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 bg-brand hover:bg-brandHover text-white font-bold py-2 px-6 rounded-md transition-all shadow-sm hover:shadow-md text-sm"
          >
            <FaWhatsapp className="w-4 h-4" />
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}