//components/store/category-store.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ICategory {
  _id: string;
  nombre: string;
  slug?: string;
  descripcion?: string;
  imagen?: string;
  activo?: boolean;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryStore {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // Acciones básicas
  setCategories: (categories: ICategory[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeCategories: (categories: ICategory[]) => void;
  refreshCategories: () => Promise<void>;
  clearStore: () => void;

  // Nuevas acciones CRUD
  addCategory: (category: ICategory) => Promise<void>;
  updateCategory: (category: ICategory) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      loading: true,
      error: null,
      initialized: false,

      setCategories: (categories) => set({ categories }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      initializeCategories: (categories) =>
        set({ categories, loading: false, error: null, initialized: true }),

      refreshCategories: async () => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/categories", { cache: "no-store" });
          if (!res.ok) throw new Error(`HTTP error ${res.status}`);
          const result = await res.json();
          if (result?.data) {
            set({
              categories: result.data,
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
        set({ categories: [], loading: true, error: null, initialized: false }),

      // ----------------------------
      // CRUD
      // ----------------------------

      addCategory: async (category) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const result = await res.json();
          if (!result?.data)
            throw new Error(result.error || "Error creando categoría");

          // actualizamos el store
          set({
            categories: [...get().categories, result.data],
            loading: false,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Error desconocido",
            loading: false,
          });
        }
      },

      updateCategory: async (category) => {
        set({ loading: true, error: null });
        try {
          // PATCH a /[id]
          const res = await fetch(`/api/categories/${category._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(category),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const result = await res.json();
          if (!result?.data)
            throw new Error(result.error || "Error actualizando categoría");

          // actualizamos el store
          set({
            categories: get().categories.map((c) =>
              c._id === category._id ? result.data : c,
            ),
            loading: false,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Error desconocido",
            loading: false,
          });
        }
      },

      deleteCategory: async (categoryId) => {
        set({ loading: true, error: null });
        try {
          const res = await fetch(`/api/categories/${categoryId}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const result = await res.json();
          if (!result?.success)
            throw new Error(result.error || "Error eliminando categoría");

          // removemos del store
          set({
            categories: get().categories.filter((c) => c._id !== categoryId),
            loading: false,
          });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Error desconocido",
            loading: false,
          });
        }
      },
    }),
    {
      name: "category-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        categories: state.categories,
        initialized: state.initialized,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) console.error("❌ Error rehidratando categorías", error);
      },
    },
  ),
);
