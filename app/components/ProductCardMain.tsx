// components/products/ProductCard.tsx
import Image from "next/image"
import { ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { IProduct } from "@/types/productTypes"
import Link from "next/link"

const SampleNextArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    type="button"
    className="absolute top-1/2 -translate-y-1/2 right-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 focus:outline-none"
    onClick={onClick}
    aria-label="Next image"
  >
    <div className="bg-brand hover:bg-brandHover rounded-full p-2 transition-colors shadow-md">
      <ChevronRight className="h-5 w-5 text-white" />
    </div>
  </button>
)

const SamplePrevArrow = ({ onClick }: { onClick?: () => void }) => (
  <button
    type="button"
    className="absolute top-1/2 -translate-y-1/2 left-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 focus:outline-none"
    onClick={onClick}
    aria-label="Previous image"
  >
    <div className="bg-brand hover:bg-brandHover rounded-full p-2 transition-colors shadow-md">
      <ChevronLeft className="h-5 w-5 text-white" />
    </div>
  </button>
)

interface ProductCardProps {
  product: IProduct
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    imagenesGenerales = [],
    especificacionesTecnicas = [],
    _id,
    nombre,
    descripcionCorta,
    precio,
    destacado,
    tieneVariaciones
  } = product

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
    adaptiveHeight: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  }

  return (
    <div className={`group relative flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg ${
      destacado ? "ring-2 ring-brand" : ""
    }`}>
      <div className="flex flex-col h-full">
        {destacado && (
          <div className="absolute top-3 right-3 bg-brand text-white text-xs font-bold px-2 py-1 rounded-full z-10 flex items-center">
            <Star className="h-3 w-3 mr-1" /> DESTACADO
          </div>
        )}

        {tieneVariaciones && (
          <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            VARIANTES
          </div>
        )}

        <div className="relative w-full h-80 bg-white overflow-hidden">
          {imagenesGenerales.length > 0 ? (
            imagenesGenerales.length > 1 ? (
              <Slider {...sliderSettings} className="h-full">
                {imagenesGenerales.map((imagen, index) => (
                  <div key={index} className="relative h-80 w-full">
                    <Image
                      src={imagen}
                      alt={`${nombre} - Imagen ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index === 0}
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="relative h-80 w-full">
                <Image
                  src={imagenesGenerales[0]}
                  alt={nombre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority
                />
              </div>
            )
          ) : (
            <div className="bg-gray-100 h-full flex items-center justify-center">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
        </div>

        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brandHover transition-colors">
            {nombre}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {descripcionCorta}
          </p>

          {especificacionesTecnicas.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                <strong>Incluye:</strong> <br />
                {especificacionesTecnicas.slice(0, 1).join(', ')}
              </p>
            </div>
          )}

          {precio && (
            <p className="text-lg mt-2 font-bold text-gray-900">
              ${precio.toLocaleString("es-AR")}
            </p>
          )}
          <Link
            href={`/catalogo/${_id}`}
            className="mt-4 pt-3 border-t border-gray-100 flex items-center text-sm text-brand font-medium"
          >
            Ver detalles
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}