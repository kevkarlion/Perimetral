//store de zustand

'use client'

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface ICategory {
  _id: string
  nombre: string
  slug?: string
  descripcion?: string
  imagen?: string
  activo?: boolean

  // Campos que faltaban
  parentId?: string | null
  createdAt?: string
  updatedAt?: string
}


interface CategoryStore {
  categories: ICategory[]
  loading: boolean
  error: string | null
  initialized: boolean

  // Acciones
  setCategories: (categories: ICategory[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  initializeCategories: (categories: ICategory[]) => void
  refreshCategories: () => Promise<void>
  clearStore: () => void
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
        set({ loading: true, error: null })
        try {
          const res = await fetch("/api/categories", { cache: "no-store" })
          if (!res.ok) throw new Error(`HTTP error ${res.status}`)
          const result = await res.json()
          if (result?.data) {
            set({ categories: result.data, loading: false, error: null, initialized: true })
          } else {
            throw new Error(result.error || "Formato inválido")
          }
        } catch (err) {
          set({ error: err instanceof Error ? err.message : "Error desconocido", loading: false })
        }
      },

      clearStore: () =>
        set({ categories: [], loading: true, error: null, initialized: false }),
    }),
    {
      name: "category-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        categories: state.categories,
        initialized: state.initialized,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) console.error("❌ Error rehidratando categorías", error)
      },
    }
  )
)
