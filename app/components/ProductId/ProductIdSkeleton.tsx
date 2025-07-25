// components/ProductId/ProductIdSkeleton.tsx
'use client'

import { Skeleton } from "@/app/components/ui/skeleton"
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function ProductIdSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-8">
      {/* Botón de volver */}
      <div className="mb-6">
        <Link href="/catalogo" className="inline-flex items-center text-gray-600 hover:text-brand transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          <Skeleton className="h-5 w-20" />
        </Link>
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Galería de imágenes */}
        <div className="flex flex-col lg:flex-row-reverse gap-4 lg:sticky lg:top-32 lg:self-start">
          <div className="w-full">
            <div className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
              <Skeleton className="h-full w-full" />
            </div>
          </div>

          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {/* Miniaturas */}
            {[...Array(3)].map((_, index) => (
              <Skeleton
                key={index}
                className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-md border-2 border-gray-200"
              />
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          {/* Encabezado */}
          <div className="space-y-3">
            <div className="hidden md:block">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-8 w-3/4 rounded" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>

          {/* Precio y variantes */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-8 w-24 rounded" />
              <Skeleton className="h-4 w-10 rounded" />
            </div>

            {/* Variantes */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-32 rounded" />
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-10 w-16 rounded-md"
                  />
                ))}
              </div>
            </div>

            {/* Botón */}
            <Skeleton className="h-10 w-full rounded" />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>

          {/* Especificaciones */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-40 rounded" />
            <ul className="space-y-3">
              {[...Array(2)].map((_, index) => (
                <li key={index} className="flex items-start">
                  <Skeleton className="h-5 w-5 rounded-full mr-3 mt-0.5" />
                  <Skeleton className="h-4 w-48 rounded" />
                </li>
              ))}
            </ul>
          </div>

          {/* Características */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-40 rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(4)].map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-12 rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* CTA desktop */}
          <div className="hidden md:block mt-8">
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* CTA móvil */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-50 flex gap-2">
        <Skeleton className="flex-1 h-12 rounded" />
        <Skeleton className="flex-1 h-12 rounded" />
      </div>
    </div>
  )
}