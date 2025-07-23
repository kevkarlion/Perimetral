// lib/stores/productStore.ts
import { create } from "zustand";
import { IProduct } from "@/lib/types/productTypes";

interface ProductStore {
  products: IProduct[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  setProducts: (products: IProduct[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeProducts: (products: IProduct[]) => void;

  currentProduct: IProduct | null;
  setCurrentProduct: (product: IProduct) => void;
  getProductById: (id: string) => IProduct | undefined;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  currentProduct: null,
  loading: true,
  error: null,
  initialized: false,

  setCurrentProduct: (product) => set({ currentProduct: product }),

  setProducts: (products) => set({ products }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  initializeProducts: (products) =>
    set({
      products,
      loading: false,
      initialized: true,
    }),

  getProductById: (id) => {
    const state = get();
    return state.products.find((p) => p._id === id);
  },
}));
