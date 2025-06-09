'use client'

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Componente personalizado para las flechas de navegación
import type { CSSProperties } from "react";

interface ArrowProps {
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

function SampleNextArrow(props: ArrowProps) {
  const { onClick } = props;
  return (
    <button
      type="button"
      className="absolute top-1/2 -translate-y-1/2 right-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 focus:outline-none"
      onClick={onClick}
      aria-label="Next image"
    >
      <div className="bg-primary/80 hover:bg-primary rounded-full p-2 transition-colors shadow-md">
        <ChevronRight className="h-5 w-5 text-white" />
      </div>
    </button>
  );
}

function SamplePrevArrow(props: ArrowProps) {
  const { onClick } = props;
  return (
    <button
      type="button"
      className="absolute top-1/2 -translate-y-1/2 left-2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 focus:outline-none"
      onClick={onClick}
      aria-label="Previous image"
    >
      <div className="bg-primary/80 hover:bg-primary rounded-full p-2 transition-colors shadow-md">
        <ChevronLeft className="h-5 w-5 text-white" />
      </div>
    </button>
  );
}

export default function ProductosSection() {
  // Configuración del carrusel con flechas personalizadas
const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  // nextArrow: <SampleNextArrow />,
  // prevArrow: <SamplePrevArrow />,
  adaptiveHeight: true,
  // autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  // Estas son las configuraciones clave:
  arrows: true, // Habilita las flechas
  prevArrow: <SamplePrevArrow />, // Usa tu componente personalizado
  nextArrow: <SampleNextArrow />, // Usa tu componente personalizado
};

  const productos = [
    {
      id: 1,
      nombre: "Alambrado Perimetral Galvanizado",
      detalle: "Medidas: 1.50×10 m | 1.80×10 m | 2×10 m",
      imagenes: [
        { src: '/Productos/alambrado/a1.webp', alt: 'Alambrado principal' },
        { src: '/Productos/alambrado/a5.webp', alt: 'Alambrado principal' },
        { src: '/Productos/alambrado/alambre-arbol1.webp', alt: 'Alambrado principal' },
        { src: '/Productos/alambrado/alambre-arbol2.webp', alt: 'Alambrado principal' },
        { src: '/Productos/alambrado/alambre-pre.webp', alt: 'Alambrado principal' }
      ],
      precio: "$80.000/m lineal + iva",
      destacado: true
    },
    {
      id: 2,
      nombre: "Alambre de puas",
      detalle: "1.80mts x 10 mts",
      imagenes: [
        { src: '/Productos/puas/pua1.webp', alt: 'Alambre de púas' },
        { src: '/Productos/puas/pua2.webp', alt: 'Alambre de púas' },
        { src: '/Productos/puas/pua-planta1.webp', alt: 'Alambre de púas' },
      ],
      precio: "$185.000",
      destacado: false
    },
    {
      id: 3,
      nombre: "Alambre de alta resistencia",
      detalle: "1.80mts x 10 mts",
      imagenes: [
        { src: '/Productos/resistencia/resistencia.webp', alt: 'Alambre de alta resistencia' },
        { src: '/Productos/resistencia/resistencia1.webp', alt: 'Alambre de alta resistencia' }
      ],
      precio: "$6.800/m lineal",
      destacado: true
    },
     {
      id: 4,
      nombre: "Postes premoldeados de hormigón",
      detalle: "1.80mts x 10 mts",
      imagenes: [
        { src: '/Productos/pre/pre1.webp', alt: 'Premoldeado' },
        { src: '/Productos/pre/pre2.webp', alt: 'Premoldeado' },
        { src: '/Productos/pre/pre3.webp', alt: 'Premoldeado' },
        { src: '/Productos/pre/pre4.webp', alt: 'Premoldeado' },
      ],
      precio: "$6.800/m lineal",
      destacado: false  
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white" id="products">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Nuestros <span className="text-primary">Productos</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Soluciones de calidad para cada necesidad de cerramiento y seguridad
          </p>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {productos.map((producto) => (
            <div 
              key={producto.id}
              className={`group relative flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg ${
                producto.destacado ? 'ring-2 ring-primary' : ''
              }`}
            >
              <Link href={`/catalogo/${producto.id}`} className="flex flex-col h-full">
                {/* Badge destacado */}
                {producto.destacado && (
                  <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full z-10 flex items-center">
                    <Star className="h-3 w-3 mr-1" /> DESTACADO
                  </div>
                )}
                
                {/* Contenedor de imágenes con flechas */}
                <div className="relative w-full h-80 bg-white overflow-hidden">
                  {producto.imagenes.length > 1 ? (
                    <Slider {...sliderSettings} className="h-full">
                      {producto.imagenes.map((imagen, index) => (
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
                  ) : (
                    <div className="relative h-80 w-full">
                      <Image
                        src={producto.imagenes[0].src}
                        alt={producto.imagenes[0].alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority
                      />
                    </div>
                  )}
                </div>
                
                {/* Contenido del producto */}
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {producto.nombre}
                  </h3>
                  {producto.detalle && (
                    <p className="mt-1 text-sm text-gray-600">
                      {producto.detalle}
                    </p>
                  )}
                  <p className="text-lg mt-2 font-bold text-gray-900">
                    {producto.precio}
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center text-sm text-primary font-medium">
                    Ver detalles
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* CTA final */}
        <div className="text-center mt-12">
          <Button asChild className="bg-primary hover:bg-primary/90 text-white py-5 px-7 text-base">
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