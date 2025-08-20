'use client'

import { Skeleton } from "@/app/components/ui/skeleton"
import { FaWhatsapp } from 'react-icons/fa'

export function CatalogLoading() {
  return (
    <div className="container mx-auto py-11 px-4 sm:px-6 lg:px-8 mt-[88px] md:mt-0">
      {/* Encabezado - Contenido real, no skeleton */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-3xl font-bold text-gray-900 mb-2">
          Catálogo de Productos
        </h1>
        <p className="text-md md:text-lg text-gray-600 max-w-3xl mx-auto">
          Soluciones profesionales para cerramientos y seguridad perimetral
        </p>
      </div>

      {/* Grid de productos CON skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 bg-white flex flex-col h-full">
            {/* Imagen con skeleton - Misma altura que el componente real */}
            <div className="relative h-40 sm:h-48 bg-gray-100">
              <Skeleton className="h-full w-full rounded-none" />
              
              {/* Badges de skeleton en las mismas posiciones */}
              <div className="absolute top-2 left-2">
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="absolute top-2 right-2">
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>

            {/* Contenido de la card con skeleton - Mismo padding que el real */}
            <div className="p-3 flex-grow flex flex-col">
              {/* Categoría */}
              <div className="mb-1">
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>

              {/* Nombre del producto - Misma altura que el real */}
              <div className="mb-2 h-10">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Sección de medidas o precio */}
              <div className="mt-auto">
                <Skeleton className="h-3 w-20 mb-1" />
                <div className="flex flex-wrap gap-1">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-5 w-10 rounded-full" />
                </div>
              </div>

              {/* Botón - Mismo borde superior y espaciado */}
              <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sección de contacto - Contenido real, no skeleton */}
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
  )
}