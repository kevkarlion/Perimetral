"use client";
import { create } from "zustand";
import { IVariation } from "@/types/ProductFormData";

interface VariationStore {
  variations: IVariation[];
  loading: boolean;
  error: string | null;

  fetchByProduct: (productId: string) => Promise<void>;
  clear: () => void;
}

export const useVariationStore = create<VariationStore>((set) => ({
  variations: [],
  loading: false,
  error: null,

  fetchByProduct: async (productId: string) => {
  set({ loading: true, error: null });

  try {
    const res = await fetch(`/api/variations?productId=${productId}`);

    const text = await res.text();
    if (!text) throw new Error("Respuesta vacía del servidor");

    const json = JSON.parse(text);

    if (!res.ok || !json.success) {
      throw new Error(json.details || json.error || "Error cargando variaciones");
    }

    set({ variations: json.data, loading: false });
  } catch (e: any) {
    console.error("Variation fetch error:", e);
    set({ error: e.message, loading: false });
  }
},


  clear: () => set({ variations: [], error: null }),
}));
