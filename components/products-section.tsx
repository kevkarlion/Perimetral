'use client'

import { ProductsLoading } from "@/components/ProductLoading";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { IProduct } from "@/lib/types/productTypes";
import { useRouter } from 'next/navigation';

// Componentes de flechas
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
);

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
);

// Componente ProductCard con manejo de navegación
const ProductCard = ({ 
  product,
  localImages,
  onViewDetails
}: {
  product: IProduct;
  localImages: Array<{ src: string; alt: string }>;
  onViewDetails: (product: IProduct) => void;
}) => {
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
  };

  return (
    <div className={`group relative flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg ${
      product.destacado ? 'ring-2 ring-brand' : ''
    }`}>
      <div className="flex flex-col h-full">
        {product.destacado && (
          <div className="absolute top-3 right-3 bg-brand text-white text-xs font-bold px-2 py-1 rounded-full z-10 flex items-center">
            <Star className="h-3 w-3 mr-1" /> DESTACADO
          </div>
        )}
        
        <div className="relative w-full h-80 bg-white overflow-hidden">
          {localImages.length > 1 ? (
            <Slider {...sliderSettings} className="h-full">
              {localImages.map((imagen, index) => (
                <div key={index} className="relative h-80 w-full">
                  <Image
                    src={imagen.src}
                    alt={imagen.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index === 0}
                  />
                </div>
              ))}
            </Slider>
          ) : localImages[0] ? (
            <div className="relative h-80 w-full">
              <Image
                src={localImages[0].src}
                alt={localImages[0].alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority
              />
            </div>
          ) : (
            <div className="bg-gray-100 h-full flex items-center justify-center">
              <span className="text-gray-400">Sin imagen</span>
            </div>
          )}
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-brandHover transition-colors">
            {product.nombre}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {product.descripcionCorta}
          </p>
          {product.precio && (
            <p className="text-lg mt-2 font-bold text-gray-900">
              ${product.precio.toLocaleString('es-AR')}
            </p>
          )}
          <button 
            onClick={() => onViewDetails(product)}
            className="mt-4 pt-3 border-t border-gray-100 flex items-center text-sm text-brand font-medium"
          >
            Ver detalles
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ProductosSection() {
  const [productos, setProductos] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const localImagesMap: Record<string, Array<{ src: string; alt: string }>> = {
    "PROD-ALAMBRADO": [
      { src: '/Productos/alambrado/a1.webp', alt: 'Alambrado principal' },
      { src: '/Productos/alambrado/a5.webp', alt: 'Alambrado principal' },
    ],
    "PROD-PUAS": [
      { src: '/Productos/puas/pua1.webp', alt: 'Alambre de púas' },
    ],
    "PROD-RESISTENCIA": [
      { src: '/Productos/resistencia/resistencia.webp', alt: 'Alambre de alta resistencia' },
    ],
    "PROD-PREMOLDEADOS": [
      { src: '/Productos/pre/pre1.webp', alt: 'Postes premoldeados' },
    ],
    "PROD-GANCHOS": [
      { src: '/Productos/accesorios/ganchos.webp', alt: 'Ganchos J' },
    ],
    "PROD-TENSORES": [
      { src: '/Productos/accesorios/tensor.webp', alt: 'Tensor mini galvanizado' },
    ]
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/stock');
        if (!response.ok) throw new Error(`Error ${response.status}`);
        
        const data: IProduct[] = await response.json();
        setProductos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleViewDetails = (product: IProduct) => {
    console.log("Navigating to product details:", product);
    // Almacenar el producto en sessionStorage para la página de detalles
    sessionStorage.setItem(`currentProduct`, JSON.stringify(product));
    router.push(`/catalogo/${product._id}`);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white" id="products">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Nuestros <span className="text-brand">Productos</span>
            </h2>
            <p className="max-w-[700px] pb-8 font-bold text-center text-gray-500 md:text-xl/relaxed">
              Soluciones de calidad para cada necesidad de cerramiento y seguridad
            </p>
          </div>
          <ProductsLoading />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-2">Error al cargar los productos</div>
        <p className="text-gray-600">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-brand hover:bg-brandHover"
        >
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white" id="products">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Nuestros <span className="text-brand">Productos</span>
          </h2>
          <p className="max-w-[700px] pb-8 font-bold text-center text-gray-500 md:text-xl/relaxed">
            Soluciones de calidad para cada necesidad de cerramiento y seguridad
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {productos.map((producto) => (
            <ProductCard 
              key={producto._id}
              product={producto}
              localImages={localImagesMap[producto.codigoPrincipal] || []}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild className="bg-brand hover:bg-brandHover text-white py-5 px-7 text-base">
            <Link href="/catalogo">
              VER CATÁLOGO COMPLETO
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}