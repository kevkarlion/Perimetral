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
import Link from 'next/link'

const CustomArrow = ({ direction, onClick }: { direction: 'next' | 'prev', onClick?: () => void }) => {
  const Icon = direction === 'next' ? ChevronRight : ChevronLeft
  return (
    <button
      type="button"
      className={`absolute top-1/2 -translate-y-1/2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 focus:outline-none ${
        direction === 'next' ? 'right-2' : 'left-2'
      }`}
      onClick={onClick}
      aria-label={`${direction === 'next' ? 'Next' : 'Previous'} image`}
    >
      <div className="bg-brand hover:bg-brandHover rounded-full p-2 transition-colors shadow-md">
        <Icon className="h-5 w-5 text-white" />
      </div>
    </button>
  )
}

export default function ProductVariantsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { products, loading, error } = useProductStore()

  // Obtener parámetros de la URL
  const productId = searchParams.get('productId')
  const productName = searchParams.get('productName')

  // Buscar el producto principal por ID
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

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 w-1/3 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="h-96 bg-gray-200 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Error al cargar el producto</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {error || 'El producto solicitado no existe'}
          </p>
          <button 
            onClick={() => router.push('/catalogo')}
            className="mt-4 bg-brand hover:bg-brand-dark text-white font-bold py-2 px-4 rounded"
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-brandHover mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Volver al catálogo
      </button>

      {/* Sección de variantes */}
      {product.tieneVariaciones && product.variaciones.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Variantes de {productName || product.nombre}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.variaciones.map((variante) => (
              <div 
                key={variante._id} 
                className="group border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20 bg-white"
              >
                <div className="relative h-64 bg-gray-100">
                  {product.imagenesGenerales?.[0] ? (
                    <Link 
                      href={{
                        pathname: `/catalogo/variants/${variante._id}`,
                        query: { 
                          productId: productId,
                          productName: productName || product.nombre
                        }
                      }}
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
                    <div className="flex items-center justify-center h-full text-gray-400">
                      Imagen no disponible
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Link 
                      href={{
                        pathname: `/catalogo/variants/${variante._id}`,
                        query: { 
                          productId: productId,
                          productName: productName || product.nombre
                        }
                      }}
                      className="group-hover:text-brandHover transition-colors"
                    >
                      <h3 className="text-lg font-bold text-gray-900">
                        {product.nombre} 
                      </h3>
                    </Link>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600">
                      <span className="font-medium">Medida:</span> {variante.medida}
                    </p>
                    {/* <p className="text-gray-600">
                      <span className="font-medium">Código:</span> {variante.codigo}
                    </p> */}
                  </div>

                  <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-200">
                    <span className="text-xl font-bold text-gray-900">
                      ${variante.precio.toLocaleString('es-AR')}
                    </span>
                    <Link
                      href={{
                        pathname: `/catalogo/variants/${variante._id}`,
                        query: { 
                          productId: productId,
                          productName: productName || product.nombre
                        }
                      }}
                      className="flex items-center text-base font-medium text-brand hover:text-brandHover transition-colors group"
                    >
                      Ver detalles
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sección de contacto */}
      <div className="mt-16 bg-gradient-to-r from-brand to-brand-dark p-0.5 rounded-xl shadow-lg">
        <div className="bg-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">¿Necesitas más información?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nuestros especialistas están disponibles para responder todas tus consultas.
          </p>
          <a
            href={`https://wa.me/5492984392148?text=Hola,%20me%20interesa%20el%20producto:%20${encodeURIComponent(product.nombre)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brandHover text-white font-bold py-3 px-8 rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            <FaWhatsapp className="w-5 h-5" />
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}