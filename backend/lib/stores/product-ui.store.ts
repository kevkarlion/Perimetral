import { create } from "zustand"
import { IProductBase } from "@/types/productTypes"

export interface ProductUIStore {
  currentProduct: IProductBase | null
  selectedVariantId: string | null

  setCurrentProduct: (p: IProductBase | null) => void
  selectVariant: (variantId: string | null) => void
  clearProduct: () => void
}

export const useProductUIStore = create<ProductUIStore>((set) => ({
  currentProduct: null,
  selectedVariantId: null,

  setCurrentProduct: (p) =>
    set({ currentProduct: p, selectedVariantId: null }),

  selectVariant: (variantId) => set({ selectedVariantId: variantId }),

  clearProduct: () =>
    set({ currentProduct: null, selectedVariantId: null }),
}))
