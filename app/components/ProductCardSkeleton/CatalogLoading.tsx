'use client'

import { Skeleton } from "@/app/components/ui/skeleton"
import { FaWhatsapp } from 'react-icons/fa'

export function CatalogLoading() {
  return (
    <div className="container mx-auto py-11 px-4 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Catálogo de Productos
        </h1>
        <p className="text-md md:text-lg text-gray-600 max-w-3xl mx-auto">
          Soluciones profesionales para cerramientos y seguridad perimetral
        </p>
      </div>

      {/* Grid de productos con skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="group border border-gray-200 rounded-lg overflow-hidden bg-white">
            <div className="relative h-48 w-full">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="p-3 space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <div className="flex flex-wrap gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-10 rounded-full" />
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de contacto CON el botón real pero deshabilitado */}
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