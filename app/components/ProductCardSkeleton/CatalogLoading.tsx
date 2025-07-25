// components/CatalogLoading.tsx
'use client'

import { Skeleton } from "@/app/components/ui/skeleton"
import { FaWhatsapp } from 'react-icons/fa'

export function CatalogLoading() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="text-center mb-16">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-[500px] max-w-full mx-auto" />
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="group border-2 border-gray-100 rounded-2xl overflow-hidden bg-white">
            {/* Imagen */}
            <div className="relative aspect-square w-full">
              <Skeleton className="h-full w-full rounded-t-2xl" />
            </div>
            
            {/* Contenido */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-20" />
              </div>
              
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
              
              {/* Especificaciones */}
              <ul className="space-y-2.5 pt-2">
                {[...Array(3)].map((_, i) => (
                  <li key={i} className="flex items-start">
                    <Skeleton className="h-5 w-5 rounded-full mr-2.5 mt-0.5" />
                    <Skeleton className="h-4 w-32" />
                  </li>
                ))}
              </ul>
              
              {/* Botón */}
              <div className="pt-6 border-t border-gray-200">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de contacto */}
      <div className="mt-16 bg-gradient-to-r from-gray-100 to-gray-200 p-0.5 rounded-xl">
        <div className="bg-white rounded-xl p-8 text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-3" />
          <Skeleton className="h-5 w-[500px] max-w-full mx-auto mb-6" />
          <div className="inline-flex items-center justify-center gap-2">
            <Skeleton className="h-12 w-48 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}