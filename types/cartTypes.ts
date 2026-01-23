import { IVariation } from "./ProductFormData";

// cartTypes.ts
export interface CartItem {
  id: string;           // combinación productId-variationId si aplica
  productId: string;    // id del producto
  variationId?: string; // id de la variación (si aplica)
  name: string;
  price: number;
  quantity: number;
  medida?: string;
  image?: string;
}

// cartTypes.ts
// cartTypes.ts
export interface CartStore {
  items: CartItem[];
  addToCart: (variation: IVariation) => void; // recibe IVariation
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

