'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Check, Star } from 'lucide-react'
import { productos } from '@/data/products'
import { notFound } from 'next/navigation'

export default function ProductoDetalle({ params }: { params: { id: string } }) {
  const [imagenPrincipal, setImagenPrincipal] = useState(0)
  const producto = productos.find((p) => p.id.toString() === params.id)

  if (!producto) {
    return notFound()
  }

  const imagenes = producto.imagenes || [{ src: producto.src, alt: producto.nombre }]

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Botón de volver */}
      <div className="mb-6">
        <Link
          href="/catalogo"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver al catálogo
        </Link>
      </div>

      {/* Contenedor principal */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Galería de imágenes sticky */}
        <div className="flex flex-col lg:flex-row gap-4 lg:sticky lg:top-36 lg:self-start">
          {/* Miniaturas verticales */}
          <div className="flex lg:flex-col gap-2 order-last lg:order-first">
            {imagenes.map((imagen, index) => (
              <button
                key={index}
                onClick={() => setImagenPrincipal(index)}
                className={`w-16 h-16 md:w-20 md:h-20 relative rounded-md overflow-hidden border-2 transition-all ${
                  imagenPrincipal === index
                    ? 'border-primary scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={imagen.src}
                  alt={imagen.alt}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>

          {/* Imagen principal */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={imagenes[imagenPrincipal].src}
                alt={imagenes[imagenPrincipal].alt}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Información del producto (contenido scrollable) */}
        <div className="space-y-6">
          {/* Encabezado */}
          <div className="space-y-3">
            {producto.destacado && (
              <div className="inline-flex items-center bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                <Star className="h-3.5 w-3.5 mr-1.5" /> DESTACADO
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{producto.nombre}</h1>
            {producto.categoria && (
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {producto.categoria}
              </span>
            )}
          </div>

          {/* Precio */}
          <div className="flex items-baseline gap-2">
            <p className="text-2xl md:text-3xl font-bold text-primary">{producto.precio}</p>
            <span className="text-sm text-gray-500">+ IVA</span>
          </div>

          {/* Descripción */}
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg">{producto.descripcionLarga || producto.descripcionCorta}</p>
          </div>

          {/* Especificaciones */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Especificaciones técnicas</h3>
            <ul className="space-y-3">
              {producto.especificaciones?.map((espec, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{espec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Características destacadas */}
          {producto.caracteristicas && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Características principales</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {producto.caracteristicas.map((caract, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-50 px-4 py-3 rounded-lg"
                  >
                    <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{caract}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aplicaciones */}
          {producto.aplicaciones && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Aplicaciones comunes</h3>
              <div className="flex flex-wrap gap-2">
                {producto.aplicaciones.map((app, index) => (
                  <span
                    key={index}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="pt-6 sticky bottom-0 bg-white pb-6 border-t border-gray-200">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors text-lg shadow-md hover:shadow-lg  sm:w-auto"
            >
              Consultar por este producto
              <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Sección de productos relacionados */}
      {/* <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos relacionados</h2> */}
        {/* Componente de grid de productos aquí */}
      {/* </div> */}
    </div>
  )
}