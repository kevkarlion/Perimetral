import { VariableIcon } from "lucide-react";
import { ObjectId } from "mongoose";
import { Types } from "mongoose";

// types/cart.ts
export interface CartItem {
  id: string | Types.ObjectId; // Cambiado a string para compatibilidad con el ID de producto
  name: string;
  price: number;
  quantity: number;
  image?: string;
  medida?: string; // Nueva propiedad para variantes
  variation?: IVariation; // Nueva propiedad para la variación
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

export interface IVariation {
  medida: string ;
  codigo: string ;
  price?: number;
  stock?: number;
}



export interface CartItemForm {
  id: string | Types.ObjectId; // Cambiado a string para compatibilidad con el ID de producto
  name: string;
  price: number;
  quantity?: number;
  image?: string;
  medida?: string; // Nueva propiedad para variantes
  variation?: IVariation; // Nueva propiedad para la variación
}