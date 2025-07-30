"use client";

import {
  Star,
  Check,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/app/components/store/product-store";
import { CatalogLoading } from "@/app/components/ProductCardSkeleton/CatalogLoading";
import { IProduct } from "@/types/productTypes";

type CustomArrowProps = {
  direction: "next" | "prev";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

const CustomArrow = ({ direction, onClick }: CustomArrowProps) => {
  const Icon = direction === "next" ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      className={`absolute top-1/2 -translate-y-1/2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 focus:outline-none ${
        direction === "next" ? "right-1" : "left-1"
      }`}
      onClick={onClick}
      aria-label={`${direction === "next" ? "Next" : "Previous"} image`}
    >
      <div className="bg-brand hover:bg-brandHover rounded-full p-1 transition-colors shadow-md">
        <Icon className="h-4 w-4 text-white" />
      </div>
    </button>
  );
};

export default function ProductosPage() {
  const router = useRouter();
  const {
    products,
    loading,
    error,
    initialized,
    setError,
    initializeProducts,
  } = useProductStore();

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
  };

  const handleViewDetails = (producto: IProduct) => {
    const variants = producto.nombre
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");

    if (producto.tieneVariaciones) {
      router.push(
        `/catalogo/variants?productId=${
          producto._id
        }&productName=${encodeURIComponent(producto.nombre)}`
      );
    } else {
      router.push(`/catalogo/${producto._id}`);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Error al cargar productos
          </h1>
          <p className="text-md md:text-lg text-gray-600 max-w-3xl mx-auto">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-brand hover:bg-brand-dark text-white font-bold py-2 px-4 rounded text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!initialized || loading) {
    return <CatalogLoading />;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Catálogo de Productos
        </h1>
        <p className="text-md md:text-lg text-gray-600 max-w-3xl mx-auto">
          Soluciones profesionales para cerramientos y seguridad perimetral
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.length > 0 ? (
          products.map((producto) => (
            <ProductCard
              key={producto._id}
              producto={producto}
              sliderSettings={sliderSettings}
              onViewDetails={handleViewDetails}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 text-md">No se encontraron productos</p>
          </div>
        )}
      </div>

      <div className="mt-8 bg-gradient-to-r from-brand to-brand-dark p-0.5 rounded-lg shadow-md">
        <div className="bg-white rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            ¿Necesitas más información?
          </h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto text-sm">
            Nuestros especialistas están disponibles para responder todas tus
            consultas.
          </p>
          <a
            href="https://wa.me/5492984392148?text=Hola,%20me%20gustaría%20solicitar%20información%20sobre%20sus%20cercos%20perimetrales"
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
  );
}

interface ProductCardProps {
  producto: IProduct;
  sliderSettings: any;
  onViewDetails: (producto: IProduct) => void;
}

const ProductCard = ({
  producto,
  sliderSettings,
  onViewDetails,
}: ProductCardProps) => {
  // Función para formatear el precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 bg-white flex flex-col h-full">
      <div className="relative h-48 bg-gray-100">
          {producto.imagenesGenerales && producto.imagenesGenerales.length > 0 ? (
          producto.imagenesGenerales.length > 1 ? (
            <Slider {...sliderSettings} className="h-full">
              {producto.imagenesGenerales.map((imagen, index) => (
                <div key={index} className="relative h-48 w-full">
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
            <div className="relative h-48 w-full">
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
          <div className="relative h-48 w-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Imagen no disponible</span>
          </div>
        )}
        {producto.destacado && (
          <div className="absolute top-2 left-2 bg-brand text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm z-10">
            <Star className="h-3 w-3 mr-1" /> DESTACADO
          </div>
        )}
      </div>

      <div className="p-3 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <button
            onClick={() => onViewDetails(producto)}
            className="group text-left flex-grow"
          >
            <h2 className="text-sm font-semibold text-gray-900 group-hover:text-brandHover transition-colors">
              {producto.nombre}
            </h2>
            {producto.descripcionCorta && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {producto.descripcionCorta}
              </p>
            )}
          </button>
          {producto.categoria && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium whitespace-nowrap ml-2 flex-shrink-0">
              {producto.categoria}
            </span>
          )}
        </div>

        {/* Sección de medidas y precios */}
        <div className="mt-2 mb-3">
          {producto.tieneVariaciones ? (
            <>
              <h4 className="text-xs text-gray-500 mb-1">Medidas disponibles</h4>
              <div className="flex flex-wrap gap-1">
                {producto.variaciones.slice(0, 3).map((variacion, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full"
                  >
                    {variacion.medida}
                  </span>
                ))}
                {producto.variaciones.length > 3 && (
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    +{producto.variaciones.length - 3}
                  </span>
                )}
              </div>
            </>
          ) : (
            producto.precio && (
              <div className="flex flex-col mt-2">
                <span className="text-xs text-gray-500">Precio</span>
                <span className="text-lg font-bold text-brand mt-1">
                  {formatPrice(producto.precio)}
                </span>
              </div>
            )
          )}
        </div>

        {/* Especificaciones técnicas (mostrar máximo 2) */}
        {producto.especificacionesTecnicas && producto.especificacionesTecnicas.length > 0 && (
          <ul className="space-y-1.5 mb-3">
            {producto.especificacionesTecnicas.slice(0, 2).map((espec, index) => (
              <li key={index} className="flex items-start text-xs">
                <Check className="h-3 w-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{espec}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100">
          <button
            onClick={() => onViewDetails(producto)}
            className="flex items-center justify-between w-full text-xs font-medium text-brand hover:text-brandHover transition-colors group"
          >
            <span>Ver detalles completos</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};



