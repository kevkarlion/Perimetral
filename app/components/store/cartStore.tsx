"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, CartStore } from "@/types/cartTypes";
import { VariationDTO } from "@/types/variation.backend";

// el cart SOLO trabaja con lo que viene del backend
const variationToCartItem = (variation: VariationDTO): CartItem => {
  if (!variation._id || !variation.productId) {
    throw new Error("La variación debe tener _id y productId");
  }

  const productId = variation.productId;

  return {
    id: `${productId}-${variation._id}`,
    productId,
    variationId: variation._id,
    name: variation.productNombre,
    price: variation.precio,
    quantity: 1,
    medida: variation.medida,
    image: variation.imagenes?.[0] || "",
  };
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      checkoutPending: false,

      addToCart: (variation: VariationDTO) => {
        const item = variationToCartItem(variation);
        const existing = get().items.find((i) => i.id === item.id);

        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (id: string) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id: string, quantity: number) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      startCheckout: () => set({ checkoutPending: true }),
      endCheckout: () =>
        set({ checkoutPending: false, items: [] }),

      getTotalItems: () =>
        get().items.reduce((total, i) => total + i.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce(
          (total, i) => total + i.price * i.quantity,
          0
        ),
    }),
    { name: "cart-storage" }
  )
);

// helper externo
export const clearCart = () => {
  if (typeof window !== "undefined") {
    useCartStore.getState().clearCart();
  }
};
