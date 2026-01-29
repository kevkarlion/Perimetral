'use client'

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/backend/lib/herlpers/fetcher";
import { useCartStore } from "@/app/components/store/cartStore";
import { useState } from "react";
import { CartSidebar } from "@/app/components/CartSideBar/CartSideBar";
import VariantDetailSkeleton from "@/app/components/Skeletons/VariantDetailSkeleton";
import { VariationDTO } from "@/types/variation.dto";
import Image from "next/image";
import { FiTag, FiStar, FiInfo, FiPackage, FiCheck, FiArrowLeft } from "react-icons/fi";

export default function VariantDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCartStore();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data, error, isLoading } = useSWR<{ success: boolean; data: VariationDTO }>(
    id ? `/api/variations/${id}` : null,
    fetcher
  );

  const variation = data?.data;

  if (!id) return <p className="mt-24 ml-10 text-red-500">Variación inválida</p>;
  if (isLoading) return <VariantDetailSkeleton />;
  if (error || !variation) return <p className="mt-24 ml-10 text-red-500">No se pudo cargar la variación</p>;

  const images = variation.imagenes && variation.imagenes.length > 0 
    ? variation.imagenes 
    : ["/no-image.png"];

  const selectedImage = images[selectedImageIndex];

  const stockStatus = (() => {
    if (variation.stock === 0) return { text: "Sin stock", className: "bg-gray-100 text-gray-600" };
    if (variation.stock <= 10) return { text: "Poco stock", className: "bg-yellow-50 text-yellow-700" };
    return { text: "Stock disponible", className: "bg-green-50 text-green-700" };
  })();

  // Verificar si hay atributos de manera segura
  const hasAttributes = variation.atributos && 
                       Array.isArray(variation.atributos) && 
                       variation.atributos.length > 0;

  const handleAddToCart = () => {
    addToCart(variation);
    setIsCartOpen(true);
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-7 px-4 mt-[88px] lg:mt-[30px]">

      {/* Botón para ir atrás */}
      <button
        onClick={handleGoBack}
        className="mb-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <FiArrowLeft size={16} />
        <span>Volver</span>
      </button>

      <h1 className="text-3xl font-bold mb-4">{variation.productNombre}</h1>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        
        {/* Sección de imágenes - Contenedor sticky */}
        <div className="lg:w-1/2">
          <div className="lg:sticky lg:top-32">
            
            {/* Mobile: imagen grande arriba, miniaturas abajo */}
            <div className="lg:hidden space-y-4">
              {/* Imagen principal */}
              <div className="relative aspect-square border rounded-lg overflow-hidden">
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                  {variation.descuento && (
                    <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                      {variation.descuento}
                    </span>
                  )}
                  {variation.destacada && (
                    <span className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
                      ★ Destacado
                    </span>
                  )}
                </div>

                <Image
                  src={selectedImage}
                  alt={variation.productNombre}
                  fill
                  className="object-contain p-6"
                />
              </div>

              {/* Miniaturas horizontales abajo */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 border rounded overflow-hidden ${
                        selectedImageIndex === index 
                          ? 'border-black ring-1 ring-black' 
                          : 'border-gray-300'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Vista ${index + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: contenedor con miniaturas verticales */}
            <div className="hidden lg:flex gap-4 h-full">
              {/* Miniaturas verticales */}
              {images.length > 1 && (
                <div className="flex flex-col gap-3 flex-shrink-0 overflow-y-auto max-h-[600px] pr-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-20 h-20 border rounded overflow-hidden flex-shrink-0 ${
                        selectedImageIndex === index 
                          ? 'border-black ring-2 ring-black' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Vista ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Imagen principal con contenedor de altura fija */}
              <div className="flex-1 flex flex-col">
                <div className="relative border rounded-lg overflow-hidden flex-grow">
                  <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {variation.descuento && (
                      <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                        {variation.descuento}
                      </span>
                    )}
                    {variation.destacada && (
                      <span className="bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow">
                        ★ Destacado
                      </span>
                    )}
                  </div>

                  <div className="relative bg-white h-full min-h-[500px]">
                    <Image
                      src={selectedImage}
                      alt={variation.productNombre}
                      fill
                      className="object-contain p-8"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>
                </div>

                {/* Contador de imágenes */}
                {images.length > 1 && (
                  <div className="text-center text-sm text-gray-500 mt-2">
                    Imagen {selectedImageIndex + 1} de {images.length}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Sección de información */}
        <div className="lg:w-1/2">
          <div className="space-y-6">
            {/* Título y nombre */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{variation.productNombre}</h1>
              <h2 className="text-xl font-semibold text-gray-700">{variation.nombre}</h2>
            </div>

            {/* Precio */}
            <div className="flex items-center gap-3">
              <p className="text-4xl font-bold text-brand">
                ${variation.precio.toLocaleString("es-AR")}
              </p>
              {variation.uMedida && (
                <span className="text-lg text-gray-500">/{variation.uMedida}</span>
              )}
            </div>

            {/* Descripción */}
            {variation.descripcion && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <FiInfo size={16} /> Descripción
                </h3>
                <p className="text-gray-600">{variation.descripcion}</p>
              </div>
            )}

            {/* Atributos - CORREGIDO */}
            {hasAttributes && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Especificaciones</h3>
                <div className="grid grid-cols-2 gap-3">
                  {variation.atributos!.map((attr, i) => (
                    <div key={i} className="bg-white border border-gray-100 rounded p-3">
                      <div className="text-sm text-gray-500 font-medium">{attr.nombre}</div>
                      <div className="font-semibold text-gray-800">{attr.valor}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Información adicional */}
            <div className="space-y-4">
              {/* Estado */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded ${variation.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  <FiCheck size={18} />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Estado</div>
                  <div className={`font-medium ${variation.activo ? 'text-green-600' : 'text-red-600'}`}>
                    {variation.activo ? 'Activo' : 'Inactivo'}
                  </div>
                </div>
              </div>

              {/* Destacado */}
              {variation.destacada && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-yellow-100 text-yellow-700">
                    <FiStar size={18} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Producto</div>
                    <div className="font-medium text-yellow-600">Destacado</div>
                  </div>
                </div>
              )}
            </div>

            {/* Stock */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${stockStatus.className}`}>
              <FiPackage size={16} />
              {stockStatus.text}
            </div>

            {/* Botón de agregar al carrito */}
            <button
              onClick={handleAddToCart}
              disabled={variation.stock === 0}
              className={`w-full h-14 rounded-lg font-medium ${
                variation.stock === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
            >
              {variation.stock === 0 ? 'AGOTADO' : 'AGREGAR AL CARRITO'}
            </button>
          </div>
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}