// lib/stores/productStore.ts
import { create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import { IProduct } from "@/types/productTypes";

interface ProductStore {
  // Estado
  products: IProduct[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
  isVariant: boolean;
  currentProduct: IProduct | null;
  
  // Acciones básicas
  setProducts: (products: IProduct[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeProducts: (products: IProduct[]) => void;
  setCurrentProduct: (product: IProduct | null) => void;
  clearCurrentProduct: () => void;
  getProductById: (id: string) => IProduct | undefined;
  
  // Acciones compuestas
  refreshProducts: () => Promise<void>;
  clearStore: () => void;
  
  // Debug
  logState: () => void;
}

// Configuración de persistencia
const persistConfig: PersistOptions<ProductStore, Partial<ProductStore>> = {
  name: "product-store",
  storage: createJSONStorage(() => localStorage),
  partialize: (state): Partial<ProductStore> => ({
    // Solo persiste estas propiedades
    products: state.products,
    initialized: state.initialized,
    isVariant: state.isVariant,
    // No persistimos loading, error ni currentProduct
  }),
  onRehydrateStorage: () => {
    console.log("💧 Zustand: Iniciando rehidratación desde localStorage");
    return (state, error) => {
      if (error) {
        console.error("❌ Zustand: Error en rehidratación:", error);
      } else {
        console.log("✅ Zustand: Rehidratación completada", {
          productos: state?.products?.length || 0,
          inicializado: state?.initialized || false,
        });
      }
    };
  },
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      products: [],
      loading: true,
      error: null,
      initialized: false,
      isVariant: false,
      currentProduct: null,

      // === ACCIONES BÁSICAS ===
      setProducts: (products) => {
        console.log("🔄 setProducts:", products.length, "productos");
        set({ products });
      },

      setLoading: (loading) => {
        console.log("🔄 setLoading:", loading);
        set({ loading });
      },

      setError: (error) => {
        console.log("🔄 setError:", error);
        set({ error });
      },

      initializeProducts: (products) => {
        console.log("🔄 initializeProducts:", products.length, "productos");
        set({
          products,
          loading: false,
          error: null,
          initialized: true,
        });
      },

      setCurrentProduct: (product) => {
        console.log("🔄 setCurrentProduct:", product?._id, product?.nombre);
        set({ currentProduct: product });
      },

      clearCurrentProduct: () => {
        console.log("🔄 clearCurrentProduct");
        set({ currentProduct: null });
      },

      getProductById: (id) => {
        const state = get();
        console.log("🔍 getProductById:", id, "en", state.products.length, "productos");
        const product = state.products.find((p) => p._id === id);
        if (!product) {
          console.warn("⚠️ Producto no encontrado:", id);
        }
        return product;
      },

      // === ACCIONES COMPUESTAS ===
      refreshProducts: async () => {
        console.log("🔄 refreshProducts: Iniciando...");
        set({ loading: true, error: null });
        
        try {
          const response = await fetch("/api/stock", {
            headers: {
              "Cache-Control": "no-cache",
              "Pragma": "no-cache",
            },
          });
          
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }
          
          const result = await response.json();
          console.log("📦 refreshProducts: Respuesta API recibida", {
            tieneData: !!result?.data,
            cantidad: result?.data?.length || 0,
          });
          
          if (result?.data) {
            set({
              products: result.data,
              loading: false,
              error: null,
              initialized: true,
            });
            console.log("✅ refreshProducts: Productos actualizados");
          } else {
            throw new Error(result.error || "Formato de respuesta inválido");
          }
        } catch (error) {
          console.error("❌ refreshProducts: Error:", error);
          set({
            error: error instanceof Error ? error.message : "Error desconocido",
            loading: false,
          });
        }
      },

      clearStore: () => {
        console.log("🗑️ clearStore: Limpiando store");
        set({
          products: [],
          loading: true,
          error: null,
          initialized: false,
          currentProduct: null,
          isVariant: false,
        });
      },

      // === DEBUG ===
      logState: () => {
        const state = get();
        console.log("📊 Estado actual del store:", {
          productos: state.products.length,
          ids: state.products.map(p => p._id),
          cargando: state.loading,
          error: state.error,
          inicializado: state.initialized,
          esVariante: state.isVariant,
          productoActual: state.currentProduct?._id,
        });
        
        if (state.products.length > 0) {
          console.log("📝 Primer producto:", {
            id: state.products[0]._id,
            nombre: state.products[0].nombre,
            variaciones: state.products[0].variaciones?.length || 0,
          });
        }
      },
    }),
    persistConfig
  )
);

// Hook de conveniencia para debug
export function useStoreDebug() {
  const store = useProductStore();
  
  // Log automático en montaje
  if (typeof window !== "undefined") {
    console.log("🏪 Store montado en cliente");
    store.logState();
  }
  
  return store;
}

// Hook para componentes que necesitan productos
export function useProducts() {
  const { products, loading, error, initialized, refreshProducts } = useProductStore();
  
  return {
    products,
    loading,
    error,
    initialized,
    refreshProducts,
    isEmpty: !loading && products.length === 0,
    hasError: !loading && !!error,
  };
}