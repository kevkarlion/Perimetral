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

      // 🔹 Agrega un producto al carrito o incrementa cantidad si ya existe
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

      // 🔹 Remueve un item del carrito
      removeItem: (id: string) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      // 🔹 Actualiza la cantidad de un item
      updateQuantity: (id: string, quantity: number) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      // 🔹 Vacía el carrito
      clearCart: () => set({ items: [] }),

      // 🔹 Total de items en el carrito
      getTotalItems: () => get().items.reduce((total, i) => total + i.quantity, 0),

      // 🔹 Total en precio del carrito
      getTotalPrice: () =>
        get().items.reduce((total, i) => total + i.price * i.quantity, 0),
    }),
    {
      name: "cart-storage", // key en localStorage
    }
  )
);

// 🔹 Función para limpiar carrito desde fuera de React
export const clearCart = () => {
  if (typeof window !== "undefined") {
    useCartStore.getState().clearCart();
  }
};
