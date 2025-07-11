'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, Check, Star, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/components/store/cartStore'
import { Button } from '@/components/ui/button'
import { CartSidebar } from '@/components/CartSideBar/CartSideBar'
import { AddToCartNotification } from '@/components/AddToCartNotification/AddToCartNotification'
import { IProduct, IVariation } from '@/lib/types/productTypes'

interface ProductDetailProps {
  product?: IProduct; // Hacerlo opcional para el caso de client-side only
  id?: string; // ID para fetch en caso necesario
}

export default function ProductId({ product: initialProduct, id }: ProductDetailProps) {
  const [product, setProduct] = useState<IProduct | null>(initialProduct || null)
  const [loading, setLoading] = useState(!initialProduct)
  const [imagenPrincipal, setImagenPrincipal] = useState(0)
  const [variacionSeleccionada, setVariacionSeleccionada] = useState(0)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [showCartSidebar, setShowCartSidebar] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  
  const addItem = useCartStore(state => state.addItem)

  useEffect(() => {
    // 1. Primero intentar obtener del sessionStorage
    const storedProduct = sessionStorage.getItem('currentProduct')
    
    if (storedProduct) {
      try {
        const parsedProduct = JSON.parse(storedProduct)
        setProduct(parsedProduct)
        sessionStorage.removeItem('currentProduct') // Limpiar después de usar
        setLoading(false)
        return
      } catch (error) {
        console.error('Error parsing stored product', error)
      }
    }

    // 2. Si no hay producto inicial ni en storage, y tenemos ID, hacer fetch
    if (!initialProduct && id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/products/${id}`)
          if (!response.ok) throw new Error('Product not found')
          const data = await response.json()
          setProduct(data)
        } catch (error) {
          console.error('Error fetching product:', error)
          // Aquí podrías redirigir a una página 404 o mostrar un error
        } finally {
          setLoading(false)
        }
      }

      fetchProduct()
    }
  }, [id, initialProduct])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/catalogo" className="inline-flex items-center text-brand hover:text-brandHover transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver al catálogo
          </Link>
        </div>
        <div className="flex justify-center items-center h-64">
          <p>Cargando producto...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/catalogo" className="inline-flex items-center text-brand hover:text-brandHover transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver al catálogo
          </Link>
        </div>
        <div className="flex justify-center items-center h-64">
          <p>Producto no encontrado</p>
        </div>
      </div>
    )
  }

  // Resto del componente igual, usando `product` en lugar de `initialProduct`
  const imagenes = product.imagenesGenerales && product.imagenesGenerales.length > 0
    ? product.imagenesGenerales.map(img => ({ src: img, alt: product.nombre }))
    : [{ src: '/placeholder-product.jpg', alt: product.nombre }]
  
  const tieneVariaciones = product.tieneVariaciones && product.variaciones.length > 0

  const handleAddToCart = () => {
    const selectedVariant = tieneVariaciones 
      ? product.variaciones[variacionSeleccionada]
      : null

    addItem({
      id: `${product._id}-${selectedVariant?._id || 'standard'}`,
      name: `${product.nombre}${selectedVariant ? ` - ${selectedVariant.medida}` : ''}`,
      price: tieneVariaciones 
        ? selectedVariant?.precio || 0
        : product.precio || 0,
      image: imagenes[0].src,
      medida: selectedVariant?.medida
    })

    setIsAddedToCart(true)
    setShowNotification(true)
    setShowCartSidebar(true)
    
    const notificationTimer = setTimeout(() => setShowNotification(false), 3000)
    const buttonTimer = setTimeout(() => setIsAddedToCart(false), 3000)

    return () => {
      clearTimeout(notificationTimer)
      clearTimeout(buttonTimer)
    }
  }

  const formatPrice = (price?: number) => {
    return price?.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })
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
        {product.destacado && (
          <div className="inline-flex items-center bg-brand text-black text-xs font-bold px-3 py-1 rounded-full">
            <Star className="h-3.5 w-3.5 mr-1.5" /> DESTACADO
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900">{product.nombre}</h1>
        {product.categoria && (
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {product.categoria}
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
            {product.destacado && (
              <div className="inline-flex items-center bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">
                <Star className="h-3.5 w-3.5 mr-1.5" /> DESTACADO
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.nombre}</h1>
            {product.categoria && (
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.categoria}
              </span>
            )}
          </div>

          {/* Precio y variantes */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl md:text-3xl font-bold text-brand">
                {tieneVariaciones 
                  ? formatPrice(product.variaciones[variacionSeleccionada].precio)
                  : formatPrice(product.precio)}
              </p>
              <span className="text-sm text-gray-500">+ IVA</span>
            </div>

            {tieneVariaciones && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">Medidas disponibles:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variaciones.map((variacion, index) => (
                    <button
                      key={variacion._id || index}
                      onClick={() => setVariacionSeleccionada(index)}
                      className={`px-4 py-2 rounded-md border transition-colors ${
                        variacionSeleccionada === index
                          ? 'border-brand bg-brand/10 text-brand font-medium'
                          : 'border-gray-300 hover:border-brand'
                      }`}
                    >
                      {variacion.medida}
                      <span className="block text-xs mt-1">{formatPrice(variacion.precio)}</span>
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
            <p className="text-lg">{product.descripcionLarga || product.descripcionCorta}</p>
          </div>

          {/* Especificaciones */}
          {product.especificacionesTecnicas && product.especificacionesTecnicas.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Especificaciones técnicas</h3>
              <ul className="space-y-3">
                {product.especificacionesTecnicas.map((espec, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{espec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Características destacadas */}
          {product.caracteristicas && product.caracteristicas.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Características principales</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.caracteristicas.map((caract, index) => (
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

          {/* CTA para desktop */}
          <div className="hidden md:block mt-8">
            <Link
              href={`/contacto?producto=${encodeURIComponent(product.nombre)}${
                tieneVariaciones ? `&variante=${encodeURIComponent(product.variaciones[variacionSeleccionada].medida)}` : ''
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
            href={`/contacto?producto=${encodeURIComponent(product.nombre)}${
              tieneVariaciones ? `&variante=${encodeURIComponent(product.variaciones[variacionSeleccionada].medida)}` : ''
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