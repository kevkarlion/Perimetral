// types/cart.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  medida?: string; // Nueva propiedad para variantes
}

export interface CartStore {
  items: CartItem[];

  // utilidad de TypeScript que crea un nuevo tipo excluyendo una propiedad específica
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}