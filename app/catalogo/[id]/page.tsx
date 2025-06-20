'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Check, Star, ShoppingCart } from 'lucide-react'
import { productos } from '@/data/products'
import { notFound } from 'next/navigation'
import { useCartStore } from '@/components/store/cartStore'
import { Button } from '@/components/ui/button'
import { CartSidebar } from '@/components/CartSideBar/CartSideBar'
import { AddToCartNotification } from '@/components/AddToCartNotification/AddToCartNotification'

interface ProductoVariacion {
  medida: string;
  precio: string;
  stock?: number;
}

interface Producto {
  id: number;
  nombre: string;
  descripcionCorta: string;
  descripcionLarga?: string;
  precio: string;
  src: string;
  imagenes?: Array<{ src: string; alt: string }>;
  categoria?: string;
  destacado?: boolean;
  tieneVariaciones?: boolean;
  variaciones?: ProductoVariacion[];
  especificaciones?: string[];
  caracteristicas?: string[];
  aplicaciones?: string[];
}

export default function ProductoDetalle({ params }: { params: { id: string } }) {
  const [imagenPrincipal, setImagenPrincipal] = useState(0)
  const [variacionSeleccionada, setVariacionSeleccionada] = useState(0)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [showCartSidebar, setShowCartSidebar] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  
  const producto = productos.find((p) => p.id.toString() === params.id)
  const addItem = useCartStore(state => state.addItem)

  if (!producto) {
    return notFound()
  }

  const imagenes = producto.imagenes && producto.imagenes.length > 0
    ? producto.imagenes
    : [{ src: producto.src, alt: producto.nombre }]
  const tieneVariaciones = !!producto.tieneVariaciones && !!producto.variaciones && producto.variaciones.length > 0

 const handleAddToCart = () => {
  const selectedVariant = tieneVariaciones 
    ? producto.variaciones?.[variacionSeleccionada]
    : null

  addItem({
    id: `${producto.id}-${selectedVariant?.medida || 'standard'}`,
    name: `${producto.nombre}${selectedVariant ? ` - ${selectedVariant.medida}` : ''}`,
    price: parseFloat(
      (tieneVariaciones 
        ? selectedVariant?.precio.replace('$', '').replace('.', '') 
        : producto.precio.replace('$', '').replace('.', '')
      ) || '0'
    ),
    image: imagenes[0].src,
    medida: selectedVariant?.medida
  })

  setIsAddedToCart(true)
  setShowNotification(true)
  setShowCartSidebar(true)
  
  // Configura el timeout para ocultar la notificación
  const notificationTimer = setTimeout(() => {
    setShowNotification(false)
  }, 3000)

  // Configura el timeout para resetear el estado del botón
  const buttonTimer = setTimeout(() => {
    setIsAddedToCart(false)
  }, 3000)

  // Limpia los timeouts cuando el componente se desmonte
  return () => {
    clearTimeout(notificationTimer)
    clearTimeout(buttonTimer)
  }
}

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-8">
      {/* Botón de volver */}
      <div className="mb-6">
        <Link
          href="/catalogo"
          className="inline-flex items-center text-brand hover:text-brandHover transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver al catálogo
        </Link>
      </div>

      {/* Encabezado móvil */}
      <div className="md:hidden space-y-3 mb-6">
        {producto.destacado && (
          <div className="inline-flex items-center bg-brand text-black text-xs font-bold px-3 py-1 rounded-full">
            <Star className="h-3.5 w-3.5 mr-1.5" /> DESTACADO
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900">{producto.nombre}</h1>
        {producto.categoria && (
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {producto.categoria}
          </span>
        )}
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Galería de imágenes */}
        <div className="flex flex-col lg:flex-row-reverse gap-4 lg:sticky lg:top-32 lg:self-start">
          <div className="w-full">
            <div className="relative aspect-square bg-contraste rounded-lg overflow-hidden">
              <Image
                src={imagenes[imagenPrincipal].src}
                alt={imagenes[imagenPrincipal].alt}
                fill
                className="object-contain p-2"
                priority
              />
            </div>
          </div>

          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {imagenes.map((imagen, index) => (
              <button
                key={index}
                onClick={() => setImagenPrincipal(index)}
                className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 relative rounded-md overflow-hidden border-2 transition-all ${
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
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Información del producto */}
        <div className="space-y-6">
          {/* Encabezado desktop */}
          <div className="hidden md:block space-y-3">
            {producto.destacado && (
              <div className="inline-flex items-center bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">
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

          {/* Precio y variantes */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl md:text-3xl font-bold text-brand">
                {tieneVariaciones 
                  ? producto.variaciones?.[variacionSeleccionada].precio
                  : producto.precio}
              </p>
              <span className="text-sm text-gray-500">+ IVA</span>
            </div>

            {tieneVariaciones && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">Medidas disponibles:</h3>
                <div className="flex flex-wrap gap-2">
                  {producto.variaciones?.map((variacion, index) => (
                    <button
                      key={index}
                      onClick={() => setVariacionSeleccionada(index)}
                      className={`px-4 py-2 rounded-md border transition-colors ${
                        variacionSeleccionada === index
                          ? 'border-brand bg-brand/10 text-brand font-medium'
                          : 'border-gray-300 hover:border-brand'
                      }`}
                    >
                      {variacion.medida}
                      <span className="block text-xs mt-1">{variacion.precio}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Botón de añadir al carrito */}
            <Button
              onClick={handleAddToCart}
              className="w-full mt-4 bg-brand hover:bg-brand-dark"
              disabled={isAddedToCart}
            >
              {isAddedToCart ? (
                <>
                  <Check className="h-5 w-5 mr-2" /> Añadido al carrito
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" /> Añadir al carrito
                </>
              )}
            </Button>
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
                    <Check className="h-5 w-5 text-brand mr-2 flex-shrink-0" />
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

          {/* CTA para desktop */}
          <div className="hidden md:block mt-8">
            <Link
              href={`/contacto?producto=${producto.nombre}${
                tieneVariaciones ? `&variante=${producto.variaciones?.[variacionSeleccionada].medida}` : ''
              }`}
              className="inline-flex items-center justify-between bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all text-sm w-full group"
            >
              <span>¿Interesado en este producto?</span>
              <span className="flex items-center bg-brand rounded px-3 py-1 ml-3 group-hover:bg-primary-dark">
                Contactar
                <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA para móvil */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-50 flex gap-2">
        <Button
          onClick={handleAddToCart}
          className="flex-1 bg-brand hover:bg-brand-dark"
          disabled={isAddedToCart}
        >
          {isAddedToCart ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
          +
        </Button>
        <Button asChild className="flex-1">
          <Link
            href={`/contacto?producto=${producto.nombre}${
              tieneVariaciones ? `&variante=${producto.variaciones?.[variacionSeleccionada].medida}` : ''
            }`}
          >
            Consultar
          </Link>
        </Button>
      </div>

      {/* Componentes de notificación y carrito */}
      <CartSidebar isOpen={showCartSidebar} onClose={() => setShowCartSidebar(false)} />
      <AddToCartNotification show={showNotification} />
    </div>
  )
}