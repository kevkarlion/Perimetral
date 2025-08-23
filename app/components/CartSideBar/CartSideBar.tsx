'use client'

import { X, Plus, Minus } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { useCartStore } from '@/app/components/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

export function CartSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { items, removeItem, getTotalPrice, updateQuantity } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)
  const scrollPosition = useRef(0)

  // Efecto para controlar la montura y animaciones
  useEffect(() => {
    if (isOpen) {
      // Guardar posición del scroll antes de abrir
      scrollPosition.current = window.scrollY || document.documentElement.scrollTop
      
      // Montar componente
      setMounted(true)
      
      // Bloquear scroll del body
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPosition.current}px`
      document.body.style.width = '100%'
      
      // Pequeño delay para activar la animación después de montar
      const animationTimer = setTimeout(() => {
        setAnimateIn(true)
      }, 10)
      
      return () => clearTimeout(animationTimer)
    } else {
      // Iniciar animación de salida
      setAnimateIn(false)
      
      // Esperar a que termine la animación antes de desmontar
      const unmountTimer = setTimeout(() => {
        setMounted(false)
        
        // Restaurar scroll del body
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo(0, scrollPosition.current)
      }, 300) // Tiempo igual a la duración de la transición
      
      return () => clearTimeout(unmountTimer)
    }
  }, [isOpen])

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(price)

  const handleIncreaseQuantity = (id: string) => {
    const item = items.find((item) => item.id === id)
    if (item) updateQuantity(id, item.quantity + 1)
  }

  const handleDecreaseQuantity = (id: string) => {
    const item = items.find((item) => item.id === id)
    if (item && item.quantity > 1) updateQuantity(id, item.quantity - 1)
  }

  // No renderizar si no está montado
  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-[1000]">
      {/* Overlay con transición de opacidad */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          animateIn ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Sidebar con transición de desplazamiento */}
      <div
        className={`fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-xl z-[1002] 
        transition-transform duration-300 ease-in-out 
        ${animateIn ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b sticky top-0 bg-white z-10">
            <h3 className="text-lg font-bold">Tu Carrito</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
              aria-label="Cerrar carrito"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Tu carrito está vacío</p>
            ) : (
              <ul className="space-y-3 px-4 py-2">
                {items.map((item) => {
                  const [productName, variant] = item.name.split(' - ')
                  return (
                    <li
                      key={item.id.toString()}
                      className="flex gap-3 py-2 border-b transition-opacity duration-200"
                    >
                      <div className="relative w-14 h-14 flex-shrink-0 border rounded-md overflow-hidden">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{productName}</h4>
                        {variant && <p className="text-xs text-gray-500">{variant}</p>}
                        <p className="text-xs text-gray-500">{formatPrice(item.price)}</p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDecreaseQuantity(item.id.toString())}
                              className={`p-1 rounded-full hover:bg-gray-100 transition-colors duration-150 ${
                                item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={item.quantity <= 1}
                              aria-label="Reducir cantidad"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleIncreaseQuantity(item.id.toString())}
                              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-150"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id.toString())}
                            className="text-gray-400 hover:text-red-500 ml-2 transition-colors duration-150"
                            aria-label="Eliminar producto"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-xs font-medium mt-1">
                          Subtotal: {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-white p-3 sticky bottom-0">
            <div className="flex justify-between font-bold text-sm mb-2">
              <span>Total ({useCartStore.getState().getTotalItems()} items):</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="flex gap-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-9 transition-all duration-150 hover:scale-[1.02]"
                onClick={onClose}
              >
                <Link href="/catalogo">Seguir comprando</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="flex-1 bg-brand hover:bg-brand-dark text-xs h-9 transition-all duration-150 hover:scale-[1.02]"
                disabled={items.length === 0}
              >
                <Link href="/cart">Finalizar compra</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}