// components/ProductCardSkeleton.tsx
'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const ProductCardSkeleton = () => {
  return (
    <div className="group border-2 border-gray-100 rounded-2xl overflow-hidden bg-white">
      {/* Imagen principal */}
      <div className="relative aspect-square w-full">
        <Skeleton className="h-full w-full" />
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
  )
}

export const ProductCardSkeletonWithSlider = () => {
  return (
    <div className="group border-2 border-gray-100 rounded-2xl overflow-hidden bg-white">
      {/* Carrusel con flechas */}
      <div className="relative aspect-square w-full">
        <Skeleton className="h-full w-full" />
        {/* Flechas */}
        <div className="absolute top-1/2 left-2 -translate-y-1/2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <div className="rounded-full p-2">
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="absolute top-1/2 right-2 -translate-y-1/2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <div className="rounded-full p-2">
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Mismo contenido que el skeleton simple */}
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-20" />
        </div>
        
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
        
        <ul className="space-y-2.5 pt-2">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="flex items-start">
              <Skeleton className="h-5 w-5 rounded-full mr-2.5 mt-0.5" />
              <Skeleton className="h-4 w-32" />
            </li>
          ))}
        </ul>
        
        <div className="pt-6 border-t border-gray-200">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}