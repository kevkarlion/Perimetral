"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, CartStore } from "@/types/cartTypes";
import { IVariation } from "@/types/ProductFormData";

const getProductId = (
  productId: string | { _id: string }
): string => {
  return typeof productId === "string"
    ? productId
    : productId._id;
};

const variationToCartItem = (variation: IVariation): CartItem => {
  if (!variation._id || !variation.productId) {
    throw new Error("La variación debe tener _id y productId");
  }

  const productId = getProductId(variation.productId);

  return {
    id: `${productId}-${variation._id}`,
    productId,                 // 🔹 ahora siempre string
    variationId: variation._id,
    name: variation.nombre,
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
      checkoutPending: false, // 🔹 nuevo flag

      addToCart: (variation: IVariation) => {
        const item = variationToCartItem(variation);
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
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

      startCheckout: () => set({ checkoutPending: true }), // 🔹 nuevo método
      endCheckout: () => set({ checkoutPending: false, items: [] }), // 🔹 limpiar carrito y flag

      getTotalItems: () => get().items.reduce((total, i) => total + i.quantity, 0),
      getTotalPrice: () =>
        get().items.reduce((total, i) => total + i.price * i.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);

// 🔹 Función para limpiar carrito desde fuera de React
export const clearCart = () => {
  if (typeof window !== "undefined") {
    useCartStore.getState().clearCart();
  }
};
