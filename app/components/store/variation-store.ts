import { create } from "zustand";
import { IVariation } from "@/types/ProductFormData";

interface VariationStore {
  variationsByProduct: Record<string, IVariation[]>;
  loading: boolean;
  error: string | null;

  fetchByProduct: (productId: string) => Promise<void>;
  clear: () => void;
}

export const useVariationStore = create<VariationStore>((set, get) => ({
  variationsByProduct: {},
  loading: false,
  error: null,

  fetchByProduct: async (productId: string) => {
    // ✅ Si ya tenemos datos, no hacemos fetch
    if (get().variationsByProduct[productId]) return;

    set({ loading: true, error: null });

    try {
      const res = await fetch(`/api/variations?productId=${productId}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.details || json.error || "Error cargando variaciones");
      }

      set({
        variationsByProduct: {
          ...get().variationsByProduct,
          [productId]: json.data,
        },
        loading: false,
      });
    } catch (e: any) {
      console.error("Variation fetch error:", e);
      set({ error: e.message, loading: false });
    }
  },

  clear: () => set({ variationsByProduct: {}, error: null }),
}));
