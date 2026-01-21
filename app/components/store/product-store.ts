"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


export interface ICategoriaRef {
  _id: string
  nombre: string
  slug?: string
}

export interface IProduct {
  _id: string;
  nombre: string;
  slug?: string;
  categoria: ICategoriaRef; // guardamos el _id de la categoría
  descripcionCorta?: string;
  descripcionLarga?: string;
  precio?: number;
  tieneVariaciones?: boolean;
  variaciones?: any[];
  imagen?: string;
  activo?: boolean;
}

interface ProductStore {
  products: IProduct[];
  loading: boolean;
  error: string | null;
  initialized: boolean;

  setProducts: (products: IProduct[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeProducts: (products: IProduct[]) => void;
  refreshProducts: () => Promise<void>;
  clearStore: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [],
      loading: true,
      error: null,
      initialized: false,

      setProducts: (products) => set({ products }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      initializeProducts: (products) =>
        set({ products, loading: false, error: null, initialized: true }),

      refreshProducts: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/products", { cache: "no-store" }); // 🔹 cambiar aquí
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          const result = await res.json();
          if (result?.data) {
            set({
              products: result.data,
              loading: false,
              error: null,
              initialized: true,
            });
          } else {
            throw new Error(result.error || "Formato inválido");
          }
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Error desconocido",
            loading: false,
          });
        }
      },

      clearStore: () =>
        set({ products: [], loading: true, error: null, initialized: false }),
    }),
    {
      name: "product-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        initialized: state.initialized,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) console.error("❌ Error rehidratando productos", error);
      },
    },
  ),
);
