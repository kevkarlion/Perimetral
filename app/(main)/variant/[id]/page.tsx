'use client'

import { useParams } from "next/navigation";
import useSWR from "swr";
import { IVariationDetail } from "@/types/ProductFormData";
import { fetcher } from "@/backend/lib/herlpers/fetcher";
import { useCartStore } from "@/app/components/store/cartStore";
import { useState } from "react";
import { CartSidebar } from "@/app/components/CartSideBar/CartSideBar";
import VariantDetailSkeleton from "@/app/components/Skeletons/VariantDetailSkeleton";

export default function VariantDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCartStore();

  // Estado local para abrir/cerrar carrito
  const [isCartOpen, setIsCartOpen] = useState(false);

  // SWR para traer la variación
  const { data, error, isLoading } = useSWR<{ success: boolean; data: IVariationDetail }>(
    id ? `/api/variations/${id}` : null,
    fetcher
  );

  const variation = data?.data;

  if (!id) return <p className="mt-24 ml-10 text-red-500">Variación inválida</p>;
   if (isLoading) return <VariantDetailSkeleton />;
  if (error || !variation) return <p className="mt-24 ml-10 text-red-500">No se pudo cargar la variación</p>;

  const cover = variation.imagenes?.[0] || "/no-image.png";

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
        <div className="flex flex-col lg:flex-row-reverse gap-4 lg:sticky lg:top-32 lg:self-start">
          <div className="w-full">
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <img src={cover} alt={variation.nombre} className="object-contain w-full h-full p-4" />
            </div>
          </div>
        </div>

        {/* Detalles */}
        <div className="space-y-8">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{variation.nombre}</h1>
            {variation.descripcion && <p className="text-gray-600 leading-relaxed">{variation.descripcion}</p>}
          </div>

          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-bold text-brand">
              ${Number(variation.precio).toLocaleString("es-AR")}
              {variation.uMedida && <span className="text-sm text-gray-700">/{variation.uMedida}</span>}
            </p>
          </div>

          {variation.stock !== undefined && (
            <p className="text-sm text-gray-600">
              Stock disponible: <span className="font-semibold">{variation.stock}</span>
            </p>
          )}

          <button
            onClick={handleAddToCart}
            className="w-full h-12 text-base font-medium bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
