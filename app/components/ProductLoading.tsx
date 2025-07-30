'use client'

import { Skeleton } from "@/app/components/ui/skeleton"
import { ChevronLeft, ChevronRight, ArrowRight, Check } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"

export function ProductsLoading() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white" id="products">
      <div className="container mx-auto px-4">
        {/* Título y subtítulo (siempre visibles) */}
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Nuestros <span className="text-brand">Productos</span>
          </h2>
          <p className="max-w-[700px] pb-8 font-bold text-center text-gray-500 md:text-xl/relaxed">
            Soluciones de calidad para cada necesidad de cerramiento y seguridad
          </p>
        </div>

        {/* Grid de productos con skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 bg-white flex flex-col h-full">
              {/* Contenedor de imagen */}
              <div className="relative h-48 bg-gray-100">
                <Skeleton className="h-full w-full absolute" />
                
                {/* Flechas del slider (solo se muestran en hover) */}
                <div className="absolute top-1/2 left-1 z-10 opacity-0 md:group-hover:opacity-100">
                  <div className="bg-gray-300 rounded-full p-1 shadow-md">
                    <ChevronLeft className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="absolute top-1/2 right-1 z-10 opacity-0 md:group-hover:opacity-100">
                  <div className="bg-gray-300 rounded-full p-1 shadow-md">
                    <ChevronRight className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                {/* Badges (simulados) */}
                <Skeleton className="absolute top-2 left-2 h-6 w-20 rounded-full" />
                <Skeleton className="absolute top-2 right-2 h-6 w-16 rounded-full" />
              </div>

              {/* Contenido de la card */}
              <div className="p-3 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-grow">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6 mt-1" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full ml-2" />
                </div>

                <div className="mt-2 mb-3">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-6 w-14 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                </div>

                <ul className="space-y-1.5 mb-3">
                  <li className="flex items-start">
                    <Skeleton className="h-4 w-4 rounded-full mr-1.5 mt-0.5 flex-shrink-0" />
                    <Skeleton className="h-4 w-3/4" />
                  </li>
                  <li className="flex items-start">
                    <Skeleton className="h-4 w-4 rounded-full mr-1.5 mt-0.5 flex-shrink-0" />
                    <Skeleton className="h-4 w-5/6" />
                  </li>
                </ul>

                <div className="mt-auto pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botón de WhatsApp (siempre visible) */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button asChild className="bg-green-500 hover:bg-green-600 rounded-full p-4 h-auto">
            <Link href="https://wa.me/tunumerodewhatsapp" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clipRule="evenodd" />
              </svg>
            </Link>
          </Button>
        </div>

        {/* Botón de catálogo (siempre visible) */}
        <div className="text-center mt-12">
          <Button
            asChild
            className="bg-brand hover:bg-brandHover text-white py-5 px-7 text-base"
          >
            <Link href="/catalogo">
              VER CATÁLOGO COMPLETO
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}