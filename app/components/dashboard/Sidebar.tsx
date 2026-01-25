'use client'

import { Package, Sliders, Activity, ShoppingCart } from 'lucide-react'

type Props = {
  active: string
  onChange: (v: any) => void
}

export default function Sidebar({ active, onChange }: Props) {
  const items = [
    { id: 'stock', icon: Package, label: 'Stock completo' },
    { id: 'manage', icon: Sliders, label: 'Gestionar stock' },
    { id: 'movements', icon: Activity, label: 'Movimientos' },
    { id: 'orders', icon: ShoppingCart, label: 'Órdenes' },
  ]

  return (
    <aside className="w-16 sm:w-20 h-screen fixed left-0 top-0 bg-[#0f0f11] border-r border-white/5 flex flex-col items-center py-6 gap-6">
      {items.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          title={label}
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition
            ${active === id 
              ? 'bg-white/10 text-white' 
              : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
          <Icon size={20} />
        </button>
      ))}
    </aside>
  )
}
