import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, CartStore } from '@/lib/types/cartTypes';

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const existing = get().items.find(i => i.id === item.id);
        set({
          items: existing
            ? get().items.map(i =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + 1 }  // Cambiado de 'cantidad' a 'quantity'
                  : i
              )
            : [...get().items, { ...item, quantity: 1 }]  // Cambiado de 'cantidad' a 'quantity'
        });
      },
      
      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.id !== id)  // Eliminado .toString() ya que id es string
        });
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item  // Cambiado de 'cantidad' a 'quantity' y eliminado .toString()
          )
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {  // Añadido este método que faltaba
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.price * item.quantity),  // Cambiado de 'precioUnitario' a 'price'
          0
        );
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);