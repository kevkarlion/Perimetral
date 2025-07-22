// components/ProductId/ProductId.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, ChevronRight, Check, Star, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/components/store/cartStore'
import { Button } from '@/components/ui/button'
import { CartSidebar } from '@/components/CartSideBar/CartSideBar'
import { AddToCartNotification } from '@/components/AddToCartNotification/AddToCartNotification'
import { IProduct, IVariation } from '@/lib/types/productTypes'
import { ProductsLoading } from '@/components/ProductLoading'

interface ProductImage {
  src: string
  alt: string
}
interface ProductIdProps {
  initialProduct?: IProduct  // Producto precargado (opcional)
}

const defaultProduct: IProduct = {
  _id: '',
  nombre: 'Cargando producto...',
  codigoPrincipal: '',
  categoria: '',
  descripcionCorta: '',
  descripcionLarga: '',
  precio: 0,
  stock: 0,
  stockMinimo: 5,
  tieneVariaciones: false,
  variaciones: [],
  especificacionesTecnicas: [],
  caracteristicas: [],
  imagenesGenerales: [],
  proveedor: '',
  destacado: false,
  activo: true,
  
}

export default function ProductId({ initialProduct }: ProductIdProps) {
  const { id } = useParams()
  const [product, setProduct] = useState<IProduct | null>(initialProduct || null)
  const [loading, setLoading] = useState(!initialProduct) // Si no hay initialProduct, carga
  const [error, setError] = useState<string | null>(null)
  
  // Estados de UI
  const [imagenPrincipal, setImagenPrincipal] = useState(0)
  const [variacionSeleccionada, setVariacionSeleccionada] = useState(0)
  const [isAddedToCart, setIsAddedToCart] = useState(false)
  const [showCartSidebar, setShowCartSidebar] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  
  // Carrito
  const addItem = useCartStore(state => state.addItem)

  // Función segura para obtener imágenes
  const getSafeImages = (product: IProduct | null): ProductImage[] => {
    if (!product) {
      return [{ src: '/placeholder-product.jpg', alt: 'Producto no disponible' }]
    }

    const imagenes = product.imagenesGenerales ?? []
    
    return imagenes.length > 0
      ? imagenes.map((img, index) => ({
          src: img || '/placeholder-product.jpg',
          alt: product.nombre ? `${product.nombre} - Imagen ${index + 1}` : 'Imagen del producto'
        }))
      : [{ src: '/placeholder-product.jpg', alt: product.nombre || 'Producto sin imágenes' }]
  }

  // Función segura para formatear precio
  const formatPrice = (price?: number) => {
    return price?.toLocaleString('es-AR', { 
      style: 'currency', 
      currency: 'ARS',
      minimumFractionDigits: 0
    }) || '$ --'
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!id) {
          throw new Error('ID de producto no proporcionado')
        }

        const response = await fetch(`/api/stock/${id}`)
        
        if (!response.ok) {
          throw new Error(`Error al cargar producto: ${response.status}`)
        }

        const result = await response.json()
        
        if (result?.success) {
          setProduct(result.data || null)
        } else {
          throw new Error(result?.error || 'Datos de producto no válidos')
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    if (!product) return

    const selectedVariant = product.tieneVariaciones ? product.variaciones?.[variacionSeleccionada] ?? null: null
    const imagenes = getSafeImages(product)

    addItem({
      id: `${product._id}-${selectedVariant?._id || 'standard'}`,
      name: `${product.nombre}${selectedVariant ? ` - ${selectedVariant.medida}` : ''}`,
      price: selectedVariant?.precio || product.precio || 0,
      image: imagenes[0]?.src || '/placeholder-product.jpg',
      medida: selectedVariant?.medida
    })

    setIsAddedToCart(true)
    setShowNotification(true)
    setShowCartSidebar(true)
    
    setTimeout(() => {
      setShowNotification(false)
      setIsAddedToCart(false)
    }, 3000)
  }

  // Producto seguro para renderizado
  const safeProduct = product || defaultProduct
  const imagenes = getSafeImages(product)
  const tieneVariaciones = safeProduct.tieneVariaciones && safeProduct.variaciones?.length > 0

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <ProductsLoading />
        <p className="text-center mt-4 text-gray-600">Cargando detalles del producto...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Error al cargar el producto</h1>
          <p className="text-lg text-gray-600 mb-6">{error}</p>
          <Button asChild>
            <Link href="/catalogo" className="text-white">
              Volver al catálogo
            </Link>
          </Button>
        </div>
      </div>
    )
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
        {safeProduct.destacado && (
          <div className="inline-flex items-center bg-brand text-black text-xs font-bold px-3 py-1 rounded-full">
            <Star className="h-3.5 w-3.5 mr-1.5" /> DESTACADO
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900">{safeProduct.nombre}</h1>
        {safeProduct.categoria && (
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {safeProduct.categoria}
          </span>
        )}
      </div>

      {/* Contenedor principal */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Galería de imágenes */}
        <div className="flex flex-col lg:flex-row-reverse gap-4 lg:sticky lg:top-32 lg:self-start">
          <div className="w-full">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={imagenes[imagenPrincipal]?.src || '/placeholder-product.jpg'}
                alt={imagenes[imagenPrincipal]?.alt || 'Imagen del producto'}
                fill
                className="object-contain p-2"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
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
                    ? 'border-brand scale-105'
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
            {safeProduct.destacado && (
              <div className="inline-flex items-center bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">
                <Star className="h-3.5 w-3.5 mr-1.5" /> DESTACADO
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{safeProduct.nombre}</h1>
            {safeProduct.categoria && (
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {safeProduct.categoria}
              </span>
            )}
          </div>

          {/* Precio y variantes */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl md:text-3xl font-bold text-brand">
                {tieneVariaciones 
                  ? formatPrice(safeProduct.variaciones[variacionSeleccionada]?.precio)
                  : formatPrice(safeProduct.precio)}
              </p>
              <span className="text-sm text-gray-500">+ IVA</span>
            </div>

            {tieneVariaciones && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900">Medidas disponibles:</h3>
                <div className="flex flex-wrap gap-2">
                  {safeProduct.variaciones?.map((variacion, index) => (
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
              disabled={isAddedToCart || !product}
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
            <p className="text-lg">
              {safeProduct.descripcionLarga || safeProduct.descripcionCorta || 'Descripción no disponible'}
            </p>
          </div>

          {/* Especificaciones técnicas */}
          {(safeProduct.especificacionesTecnicas?.length ?? 0) > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Especificaciones técnicas</h3>
              <ul className="space-y-3">
                {safeProduct.especificacionesTecnicas?.map((espec, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{espec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Características destacadas */}
          {(safeProduct.caracteristicas?.length ?? 0) > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Características principales</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {safeProduct.caracteristicas?.map((caract, index) => (
                  <div
                    key={`${caract}-${index}`}
                    className="flex items-center bg-gray-50 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100"
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
              href={`/contacto?producto=${encodeURIComponent(safeProduct.nombre)}${
                tieneVariaciones ? `&variante=${encodeURIComponent(safeProduct.variaciones[variacionSeleccionada]?.medida || '')}` : ''
              }`}
              className="inline-flex items-center justify-between bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all text-sm w-full group"
            >
              <span>¿Interesado en este producto?</span>
              <span className="flex items-center bg-brand rounded px-3 py-1 ml-3 group-hover:bg-brand-dark">
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
          disabled={isAddedToCart || !product}
        >
          {isAddedToCart ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
          {isAddedToCart ? 'Añadido' : 'Comprar'}
        </Button>
        <Button asChild className="flex-1">
          <Link
            href={`/contacto?producto=${encodeURIComponent(safeProduct.nombre)}${
              tieneVariaciones ? `&variante=${encodeURIComponent(safeProduct.variaciones[variacionSeleccionada]?.medida || '')}` : ''
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