'use client'

import { Check } from 'lucide-react'

export function AddToCartNotification({ show }: { show: boolean }) {
  return (
    <div className={`fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-opacity ${
      show ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <Check className="h-5 w-5" />
      <span>Producto agregado al carrito</span>
    </div>
  )
}