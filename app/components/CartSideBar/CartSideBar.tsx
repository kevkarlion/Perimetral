'use client'

import { X, Plus, Minus } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { useCartStore } from '@/app/components/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, Variants, Transition } from 'framer-motion'

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.3 } as Transition
  }
}

const sidebarVariants: Variants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: { 
      type: 'tween' as const, 
      ease: 'easeOut' as const, 
      duration: 0.3 
    } as Transition
  },
  exit: { 
    x: '100%',
    transition: { 
      type: 'tween' as const, 
      ease: 'easeIn' as const, 
      duration: 0.25 
    } as Transition
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2 } as Transition
  },
  exit: { 
    opacity: 0, 
    transition: { duration: 0.15 } as Transition
  }
}

const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    } as Transition
  }
}

export function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeItem, getTotalPrice, updateQuantity } = useCartStore()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const scrollPosition = useRef(0)
  
  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  // Bloquear scroll del body al abrir el sidebar
  useEffect(() => {
    if (isOpen) {
      scrollPosition.current = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollPosition.current}px`
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollPosition.current)
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollPosition.current)
    }
  }, [isOpen])

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price)

  const handleIncreaseQuantity = (id: string) => {
    const item = items.find(item => item.id === id)
    if (item) updateQuantity(id, item.quantity + 1)
  }

  const handleDecreaseQuantity = (id: string) => {
    const item = items.find(item => item.id === id)
    if (item && item.quantity > 1) {
      updateQuantity(id, item.quantity - 1)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-[1000]">
          {/* Overlay */}
          <motion.div
            key="overlay"
            className="absolute inset-0 bg-black/50 z-[1001]"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            key="sidebar"
            ref={sidebarRef}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-xl z-[1002] overflow-y-auto"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
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
                  <motion.p 
                    className="text-gray-500 text-center py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 } as Transition}
                  >
                    Tu carrito está vacío
                  </motion.p>
                ) : (
                  <motion.ul 
                    className="space-y-3 px-4 py-2"
                    variants={staggerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {items.map((item) => {
                      const [productName, variant] = item.name.split(' - ')
                      return (
                        <motion.li 
                          key={item.id.toString()} 
                          className="flex gap-3 py-2 border-b"
                          variants={itemVariants}
                          layout
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
                                  className={`p-1 rounded-full hover:bg-gray-100 transition-colors duration-150 ${item.quantity <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        </motion.li>
                      )
                    })}
                  </motion.ul>
                )}
              </div>
              
              {/* Footer */}
              <motion.div 
                className="border-t bg-white p-3 sticky bottom-0"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 } as Transition}
              >
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
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
