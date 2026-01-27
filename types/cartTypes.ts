import { IVariation } from "./ProductFormData";

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

export interface CartStore {
  items: CartItem[];
  checkoutPending: boolean;          // 🔹 nuevo flag
  addToCart: (variation: IVariation) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  startCheckout: () => void;          // 🔹 inicia checkout
  endCheckout: () => void;            // 🔹 termina checkout y limpia carrito
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
