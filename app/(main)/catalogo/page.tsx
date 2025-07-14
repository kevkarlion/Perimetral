// app/(main)/catalogo/page.tsx
'use client'

import { Star, Check, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import Slider from 'react-slick'
import Image from 'next/image'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IProduct } from '@/lib/types/productTypes'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton/ProductCardSkeleton'

type CustomArrowProps = {
  direction: 'next' | 'prev'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const CustomArrow = ({ direction, onClick }: CustomArrowProps) => {
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

export default function ProductosPage() {
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/stock')
        if (!response.ok) {
          throw new Error('Error al cargar los productos')
        }
        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleViewDetails = (producto: IProduct) => {
    // Almacenar el producto en sessionStorage para acceso inmediato
    sessionStorage.setItem('currentProduct', JSON.stringify(producto))
    // Navegar a la página de detalle
    router.push(`/catalogo/${producto._id}`)
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Error al cargar productos</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-brand hover:bg-brand-dark text-white font-bold py-2 px-4 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Catálogo de Productos</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          {loading ? 'Cargando productos...' : 'Soluciones profesionales para cerramientos y seguridad perimetral'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {loading ? (
          <>
            {[...Array(6)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </>
        ) : (
          products.map((producto) => (
            <ProductCard 
              key={producto._id} 
              producto={producto} 
              sliderSettings={sliderSettings}
              onViewDetails={handleViewDetails}
            />
          ))
        )}
      </div>

      <div className="mt-16 bg-gradient-to-r from-brand to-brand-dark p-0.5 rounded-xl shadow-lg">
        <div className="bg-white rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">¿Necesitas más información?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Nuestros especialistas están disponibles para responder todas tus consultas.
          </p>
          <a
            href="https://wa.me/5492984392148?text=Hola,%20me%20gustaría%20solicitar%20información%20sobre%20sus%20cercos%20perimetrales"
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

interface ProductCardProps {
  producto: IProduct
  sliderSettings: any
  onViewDetails: (producto: IProduct) => void
}

const ProductCard = ({ 
  producto, 
  sliderSettings,
  onViewDetails
}: ProductCardProps) => {
  return (
    <div className="group border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20 bg-white">
      <div className="relative h-96 bg-gray-100">
        {Array.isArray(producto.imagenesGenerales) && producto.imagenesGenerales.length > 0 ? (
          producto.imagenesGenerales.length > 1 ? (
            <Slider {...sliderSettings} className="h-full">
              {producto.imagenesGenerales.map((imagen, index) => (
                <div key={index} className="relative h-96 w-full">
                  <button 
                    onClick={() => onViewDetails(producto)}
                    className="block h-full w-full"
                  >
                    <Image
                      src={imagen}
                      alt={producto.nombre}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === 0}
                    />
                  </button>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="relative h-96 w-full">
              <button 
                onClick={() => onViewDetails(producto)}
                className="block h-full w-full"
              >
                <Image
                  src={producto.imagenesGenerales[0]}
                  alt={producto.nombre}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </button>
            </div>
          )
        ) : (
          <div className="relative h-96 w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Imagen no disponible</span>
          </div>
        )}
        {producto.destacado && (
          <div className="absolute top-4 left-4 bg-brand text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center shadow-md z-10">
            <Star className="h-4 w-4 mr-1.5" /> DESTACADO
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <button 
            onClick={() => onViewDetails(producto)}
            className="group text-left"
          >
            <h2 className="text-lg font-bold text-gray-900 group-hover:text-brandHover transition-colors line-clamp-2">
              {producto.nombre}
            </h2>
          </button>
          {producto.categoria && (
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full font-medium whitespace-nowrap ml-3">
              {producto.categoria}
            </span>
          )}
        </div>

        {producto.descripcionCorta && (
          <p className="text-gray-600 text-base mb-5 line-clamp-3">
            {producto.descripcionCorta}
          </p>
        )}

        {producto.especificacionesTecnicas && (
          <ul className="space-y-2.5 mb-6">
            {producto.especificacionesTecnicas.slice(0, 3).map((espec, index) => (
              <li key={index} className="flex items-start text-base">
                <Check className="h-5 w-5 text-green-500 mr-2.5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{espec}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-end justify-between mt-6 pt-6 border-t border-gray-200">
          <button 
            onClick={() => onViewDetails(producto)}
            className="flex items-center text-base font-medium text-brand hover:text-brandHover transition-colors group"
          >
            Ver detalles
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}