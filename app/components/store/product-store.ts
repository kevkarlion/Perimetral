"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ICategoriaRef {
  _id: string;
  nombre: string;
  slug?: string;
}

export interface IProduct {
  _id: string;
  nombre: string;
  slug?: string;
  categoria: ICategoriaRef;
  destacado?: boolean;
  descripcionCorta?: string;
  descripcionLarga?: string;

  codigoPrincipal: string;

  precio?: number;

  tieneVariaciones?: boolean;
  variaciones?: any[];

  // 👇 NUEVO
  imagenes?: string[];

  activo?: boolean;
  variationsCount: number;
}

interface ProductStore {
  products: IProduct[];
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // setters
  setProducts: (products: IProduct[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeProducts: (products: IProduct[]) => void;

  // acciones
  refreshProducts: () => Promise<void>;
  clearStore: () => void;

  // selectores derivados
  getByCategory: (categoryId: string) => IProduct[];
  getById: (productId: string) => IProduct | undefined;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      loading: false,
      initialized: false,
      error: null,

      setProducts: (products) => set({ products }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      initializeProducts: (products) =>
        set({
          products,
          loading: false,
          error: null,
          initialized: true,
        }),

      refreshProducts: async () => {
        set({ loading: true, error: null });

        try {
          const res = await fetch("/api/products", { cache: "no-store" });
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);

          const result = await res.json();
          if (!result?.data) throw new Error("Formato inválido");

          set({
            products: result.data,
            loading: false,
            error: null,
            initialized: true,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Error desconocido",
            loading: false,
          });
        }
      },

      // 🔍 filtros en memoria
      getByCategory: (categoryId) =>
        get().products.filter(
          (p) => p.categoria && p.categoria._id === categoryId
        ),

      getById: (productId) =>
        get().products.find((p) => p._id === productId),

      clearStore: () =>
        set({
          products: [],
          loading: true,
          error: null,
          initialized: false,
        }),
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
    }
  )
);
