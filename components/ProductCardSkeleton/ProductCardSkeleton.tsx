'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

export const ProductCardSkeleton = () => {
  return (
    <div className="group border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20 bg-white animate-pulse">
      {/* Carrusel de imágenes skeleton */}
      <div className="relative h-96 bg-gray-200 rounded-t-2xl">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-full bg-gray-300"></div>
        </div>
      </div>

      {/* Contenido de la card skeleton */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 ml-3"></div>
        </div>

        <div className="space-y-2 mb-5">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Especificaciones skeleton */}
        <ul className="space-y-2.5 mb-6">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="flex items-start">
              <div className="h-5 w-5 bg-gray-200 rounded-full mr-2.5 mt-0.5"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </li>
          ))}
        </ul>

        <div className="flex items-end justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  )
}

export const ProductCardSkeletonWithSlider = () => {
  return (
    <div className="group border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20 bg-white animate-pulse">
      {/* Carrusel skeleton con flechas */}
      <div className="relative h-96 bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-full bg-gray-300"></div>
        </div>
        {/* Flechas skeleton */}
        <button className="absolute top-1/2 left-2 -translate-y-1/2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <div className="bg-gray-300 rounded-full p-2 shadow-md">
            <ChevronLeft className="h-5 w-5 text-gray-400" />
          </div>
        </button>
        <button className="absolute top-1/2 right-2 -translate-y-1/2 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <div className="bg-gray-300 rounded-full p-2 shadow-md">
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </button>
      </div>

      {/* Contenido idéntico al skeleton simple */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 ml-3"></div>
        </div>

        <div className="space-y-2 mb-5">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>

        <ul className="space-y-2.5 mb-6">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="flex items-start">
              <div className="h-5 w-5 bg-gray-200 rounded-full mr-2.5 mt-0.5"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </li>
          ))}
        </ul>

        <div className="flex items-end justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  )
}