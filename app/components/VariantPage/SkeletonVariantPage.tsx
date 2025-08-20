'use client'

import { Skeleton } from "@/app/components/ui/skeleton"
import { ArrowLeft } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

interface VariantLoadingProps {
  productName?: string | null;
}

export function SkeletonVariantPage({ productName }: VariantLoadingProps) {
  return (
    <div className="container mx-auto py-7 px-4 sm:px-6 lg:px-8 mt-[88px] md:mt-0">
      {/* Botón de volver - Siempre visible */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-brand font-bold hover:text-brandHover transition-colors mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Volver
      </button>

      {/* Sección de variantes - Título siempre visible */}
      <div className="mt-8">
        <h2 className="text-3xl md:text-2xl font-bold text-gray-900 mb-6">
          Variantes de {productName || '...'}
        </h2>
        
        {/* Grid de skeletons para las variantes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index} 
              className="group border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col h-full"
            >
              <div className="relative h-48 bg-gray-100">
                <Skeleton className="h-full w-full" />
              </div>

              <div className="p-3 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-grow">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                  </div>
                </div>

                <div className="mb-2">
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-4 w-20 rounded-full" />
                </div>

                <div className="flex flex-col mt-2">
                  <Skeleton className="h-3 w-16 mb-1" />
                  <Skeleton className="h-6 w-24" />
                </div>

                <div className="mt-auto pt-3 border-t border-gray-100">
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de contacto - Igual que en CatalogLoading */}
      <div className="mt-8 bg-gradient-to-r from-brand to-brand-dark p-0.5 rounded-lg shadow-md">
        <div className="bg-white rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            ¿Necesitas más información?
          </h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto text-sm">
            Nuestros especialistas están disponibles para responder todas tus consultas.
          </p>
          
          {/* Botón idéntico al original pero con pointer-events-none */}
          <div className="inline-flex items-center justify-center gap-1 bg-brand text-white font-bold py-2 px-6 rounded-md transition-all shadow-sm text-sm pointer-events-none">
            <FaWhatsapp className="w-4 h-4" />
            Contactar por WhatsApp
          </div>
        </div>
      </div>
    </div>
  )
}