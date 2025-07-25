'use client'

import { X, Plus, Minus } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { useCartStore } from '@/app/components/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'

export function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeItem, getTotalPrice, updateQuantity } = useCartStore()
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)
  }

  const handleIncreaseQuantity = (id: string) => {
    const item = items.find(item => item.id === id)
    if (item) {
      updateQuantity(id, item.quantity + 1)
    }
  }

  const handleDecreaseQuantity = (id: string) => {
    const item = items.find(item => item.id === id)
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1)
    }
  }

  return (
    <div className={`fixed inset-0 z-[1000] ${isOpen ? 'block' : 'hidden'}`}>
      {/* Fondo oscuro con z-index menor */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity z-[1001]"
        onClick={onClose}
      />
      
      {/* Panel lateral con z-index mayor */}
      <div className={`fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-xl transition-transform duration-300 ease-in-out z-[1002] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Contenedor principal con padding superior */}
        <div className="h-full flex flex-col pt-[var(--navbar-height)]">
          {/* Encabezado sticky */}
          <div className="flex items-center justify-between p-3 border-b sticky top-[var(--navbar-height)] bg-white z-10">
            <h3 className="text-lg font-bold">Tu Carrito</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Área de scroll */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Tu carrito está vacío</p>
            ) : (
              <ul className="space-y-3 px-4 py-2">
                {items.map((item) => {
                  const [productName, variant] = item.name.split(' - ')
                  return (
                    <li key={item.id} className="flex gap-3 py-2 border-b">
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
                              onClick={() => handleDecreaseQuantity(item.id)}
                              className={`p-1 rounded-full hover:bg-gray-100 ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs w-6 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => handleIncreaseQuantity(item.id)}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 ml-2"
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
          
          {/* Barra inferior fija */}
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
                className="flex-1 text-xs h-9"
                onClick={onClose}
              >
                <Link href="/catalogo">Seguir comprando</Link>
              </Button>
              <Button 
                asChild 
                size="sm"
                className="flex-1 bg-brand hover:bg-brand-dark text-xs h-9"
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