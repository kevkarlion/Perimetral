'use client'

import { useParams } from "next/navigation";
import useSWR from "swr";
import { IVariationDetail } from "@/types/ProductFormData";
import { fetcher } from "@/backend/lib/herlpers/fetcher";
import { useCartStore } from "@/app/components/store/cartStore";
import { useState } from "react";
import { CartSidebar } from "@/app/components/CartSideBar/CartSideBar";
import VariantDetailSkeleton from "@/app/components/Skeletons/VariantDetailSkeleton";
import Image from "next/image";

export default function VariantDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCartStore();

  // Estado local para abrir/cerrar carrito
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Estado para la imagen seleccionada
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // SWR para traer la variación
  const { data, error, isLoading } = useSWR<{ success: boolean; data: IVariationDetail }>(
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

  // Manejo del stock según lo pedido
  const getStockStatus = () => {
    if (variation.stock === undefined || variation.stock === null) return null;
    
    if (variation.stock === 0) {
      return { text: "Sin stock", className: "bg-gray-100 text-gray-600" };
    } else if (variation.stock <= 10) {
      return { text: "Poco stock", className: "bg-yellow-50 text-yellow-700" };
    } else {
      return { text: "Stock disponible", className: "bg-green-50 text-green-700" };
    }
  };

  const stockStatus = getStockStatus();

  // Verificar si hay atributos
  const hasAttributes = variation.atributos && Array.isArray(variation.atributos) && variation.atributos.length > 0;

  const handleAddToCart = () => {
    addToCart(variation);
    setIsCartOpen(true); // abre el sidebar automáticamente
  };

  return (
    <div className="container mx-auto py-7 px-4 sm:px-6 lg:px-8 mt-[88px] md:mt-0">
      
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-4 flex gap-2 items-center">
        <span className="hover:text-brand cursor-pointer">Inicio</span>
        <span>›</span>
        {variation.categoriaNombre && <><span className="hover:text-brand cursor-pointer">{variation.categoriaNombre}</span><span>›</span></>}
        {variation.productNombre && <><span className="hover:text-brand cursor-pointer">{variation.productNombre}</span><span>›</span></>}
        <span className="font-semibold">{variation.nombre}</span>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Galería */}
        <div className="flex flex-col lg:flex-row gap-4 lg:sticky lg:top-32 lg:self-start">
          
          {/* Miniaturas verticales a la izquierda */}
          {images.length > 1 && (
            <div className="lg:w-20 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto pb-2 lg:pb-0">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 lg:w-full lg:h-16 border-2 rounded-lg overflow-hidden transition-all ${
                    selectedImageIndex === index 
                      ? "border-brand ring-2 ring-brand/20" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img}
                      alt={`Miniatura ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 64px, 80px"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Imagen principal */}
          <div className="flex-1">
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={selectedImage}
                alt={variation.nombre}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              
              {/* Controles de navegación para móvil */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === 0 ? images.length - 1 : prev - 1
                    )}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition lg:hidden"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(prev => 
                      (prev + 1) % images.length
                    )}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition lg:hidden"
                  >
                    ›
                  </button>
                </>
              )}
              
              {/* Indicador de imagen */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                  {selectedImageIndex + 1} / {images.length}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detalles - ORDEN SOLICITADO */}
        <div className="space-y-6">
          {/* 1. Nombre */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{variation.nombre}</h1>
            {variation.descripcion && <p className="text-gray-600 leading-relaxed text-sm">{variation.descripcion}</p>}
          </div>

          {/* 2. Precio */}
          <div className="flex items-baseline gap-3 py-4 border-b">
            <p className="text-4xl font-bold text-brand">
              ${Number(variation.precio).toLocaleString("es-AR")}
              {variation.uMedida && <span className="text-sm text-gray-700 ml-1">/{variation.uMedida}</span>}
            </p>
          </div>

          {/* 3. Medida */}
          {variation.medida && (
            <div className="py-4 border-b">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">Medida:</span>
                <span className="text-gray-700">{variation.medida} {variation.uMedida}</span>
              </div>
            </div>
          )}

          {/* 4. Atributos - CORREGIDO para tu estructura */}
          {hasAttributes && (
            <div className="py-4 border-b">
              <h3 className="font-medium text-gray-900 mb-3">Especificaciones:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {variation.atributos?.map((attr, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium capitalize">
                      {attr.nombre}:
                    </span>
                    <span className="text-sm text-gray-700">
                      {attr.valor}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Estado del stock */}
          {stockStatus && (
            <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg ${stockStatus.className}`}>
              <span className="font-medium">{stockStatus.text}</span>
            </div>
          )}

          {/* 6. Botón Agregar al carrito */}
          <div className="pt-4">
            <button
              onClick={handleAddToCart}
              disabled={variation.stock === 0}
              className={`w-full h-14 text-base font-medium rounded-lg transition-all duration-200 ${
                variation.stock === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-900 active:scale-[0.98]"
              }`}
            >
              {variation.stock === 0 ? "Sin stock" : "Agregar al carrito"}
            </button>
          </div>

          {/* Información adicional (opcional, al final) */}
          <div className="border-t pt-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-3">Información adicional</h3>
            <div className="space-y-3 text-sm text-gray-600">
              {variation.categoriaNombre && (
                <div className="flex">
                  <span className="w-32 font-medium text-gray-700">Categoría:</span>
                  <span>{variation.categoriaNombre}</span>
                </div>
              )}
              {variation.productNombre && (
                <div className="flex">
                  <span className="w-32 font-medium text-gray-700">Producto base:</span>
                  <span>{variation.productNombre}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}