import { VariationDTO } from "@/types/variation.backend";

export interface CartItem {
  id: string;
  productId: string;
  variationId?: string;
  name: string;
  price: number;
  quantity: number;
  medida?: string;
  image?: string;
}

export interface CartStore {
  items: CartItem[];
  checkoutPending: boolean;

  addToCart: (variation: VariationDTO) => void;

  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;

  startCheckout: () => void;
  endCheckout: () => void;

  getTotalItems: () => number;
  getTotalPrice: () => number;
}
