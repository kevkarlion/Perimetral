"use client";

import Image from "next/image";
import {
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IProduct } from "@/types/productTypes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/app/components/store/product-store";

const CustomArrow = ({
  direction,
  onClick,
}: {
  direction: "next" | "prev";
  onClick?: () => void;
}) => {
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

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCardMain({ product }: ProductCardProps) {
  const router = useRouter();
  const { setCurrentProduct } = useProductStore();

  const {
    _id,
    nombre,
    descripcionCorta,
    precio,
    medida,
    destacado,
    tieneVariaciones,
    variaciones = [],
    categoria,
    especificacionesTecnicas = [],
    imagenesGenerales = [],
  } = product;

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(price);
  };

  const handleViewDetails = () => {
    setCurrentProduct(product);

    if (tieneVariaciones) {
      router.push(
        `/catalogo/variants?productId=${_id}&productName=${encodeURIComponent(
          nombre
        )}`
      );
    } else {
      router.push(`/catalogo/${_id}`);
    }
  };

  return (
    <div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 bg-white flex flex-col h-full">
      {/* Contenedor de imagen */}
      <div className="relative h-48 bg-gray-100">
        {imagenesGenerales.length > 0 ? (
          imagenesGenerales.length > 1 ? (
            <Slider {...sliderSettings} className="h-full">
              {imagenesGenerales.map((imagen, index) => (
                <div key={index} className="relative h-48 w-full">
                  <button
                    onClick={handleViewDetails}
                    className="block h-full w-full"
                  >
                    <Image
                      src={imagen}
                      alt={`${nombre} - Imagen ${index + 1}`}
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
                onClick={handleViewDetails}
                className="block h-full w-full"
              >
                <Image
                  src={imagenesGenerales[0]}
                  alt={nombre}
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
        {destacado && (
          <div className="absolute top-2 left-2 bg-brand text-white text-xs font-bold px-2 py-1 rounded-full flex items-center shadow-sm z-10">
            <Star className="h-3 w-3 mr-1" /> DESTACADO
          </div>
        )}
        {tieneVariaciones && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            VARIANTES
          </div>
        )}
      </div>

      {/* Contenido de la card */}
      <div className="p-3 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <button
            onClick={handleViewDetails}
            className="group text-left flex-grow"
          >
            <h2 className="text-sm font-semibold text-gray-900 group-hover:text-brandHover transition-colors">
              {nombre}
            </h2>
            {descripcionCorta && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {descripcionCorta}
              </p>
            )}
          </button>
          {categoria &&
            typeof categoria === "object" &&
            "nombre" in categoria && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium whitespace-nowrap ml-2 flex-shrink-0">
                {categoria.nombre}
              </span>
            )}
        </div>

        <div className="mt-2 mb-3">
          {tieneVariaciones ? (
            <>
              <h4 className="text-xs text-gray-500 mb-1">
                Medidas disponibles
              </h4>
              <div className="flex flex-wrap gap-1">
                {variaciones.slice(0, 3).map((variacion, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full"
                  >
                    {variacion.medida}
                  </span>
                ))}
                {variaciones.length > 3 && (
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    +{variaciones.length - 3}
                  </span>
                )}
              </div>
            </>
          ) : (
            precio && (
              <div className="flex flex-col mt-2">
                <span className="text-xs text-gray-500">Precio</span>
                <span className="text-lg font-bold text-brand mt-1">
                  {formatPrice(precio)}
                  {medida && <span className="text-sm font-normal">/{medida}</span>}
                </span>
              </div>
            )
          )}
        </div>

        {especificacionesTecnicas.length > 0 && (
          <ul className="space-y-1.5 mb-3">
            {especificacionesTecnicas.slice(0, 2).map((espec, index) => (
              <li key={index} className="flex items-start text-xs">
                <Check className="h-3 w-3 text-green-500 mr-1.5 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{espec}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100">
          <button
            onClick={handleViewDetails}
            className="flex items-center justify-between w-full text-xs font-medium text-brand hover:text-brandHover transition-colors group"
          >
            <span>Ver detalles completos</span>
            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}