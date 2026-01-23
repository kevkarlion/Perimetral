import { Document, Types } from "mongoose";


//solo DB
export interface IOrderItem {
  productId: Types.ObjectId;
  variationId?: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  priceWithVat?: number;
  image?: string;
  medida?: string;
  sku?: string;
}


//FRONT
export interface CartItemDTO {
  productId: string;
  variationId: string;
  quantity: number;
}



// Resultado de la validación de items del carrito
export interface ValidatedCartItem {
  productId: Types.ObjectId;
  variationId: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  medida?: string;
  sku?: string;
  stock: number;
}



export interface IOrderData {
  _id: string;
  orderNumber: string;
  accessToken: string;
  customer: ICustomerData;
  items: IOrderItem[];
  total: number;
  subtotal?: number;
  vat?: number;
  shippingCost?: number;
  status: 'pending' | 'pending_payment' | 'processing' | 'completed' | 'payment_failed' | 'cancelled';
  paymentMethod: string;
  paymentDetails?: IPaymentDetails;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}



export interface ICustomerData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dni?: string;
}

export interface IPaymentDetails {
  method: "mercadopago" | "transferencia" | "efectivo" | "tarjeta";
  status: "pending" | "approved" | "rejected" | "refunded";
  transactionId?: string;
  mercadopagoPreferenceId?: string;
  paymentUrl?: string;
  approvedAt?: Date;
  expirationDate?: Date; // Para pagos en efectivo
  isCashPayment?: boolean;
  [key: string]: any;
}

export interface IOrder extends Document {
  _id: string;
  discount: number;
  customer: ICustomerData;
  items: IOrderItem[];
  subtotal: number;
  vat: number;
  total: number;
  shippingCost?: number;
  status:
    | "pending"
    | "pending_payment"
    | "processing"
    | "completed"
    | "cancelled"
    | "refunded"
    | "payment_failed";
  paymentMethod: string;
  paymentDetails?: IPaymentDetails;
  notes?: string; // 🔹 Nuevo campo para anotaciones
  createdAt: Date;
  updatedAt: Date;
  orderNumber: string;
  accessToken: string;
  
}

// Tipos derivados
export type OrderStatus = IOrder["status"];
export type PaymentMethod = IOrder["paymentMethod"];

// Tipos para respuesta de API
export interface OrderResponse {
  success: boolean;
  order: IOrder;
  paymentUrl?: string;
  error?: string;
}

// Tipo para crear nuevas órdenes (sin campos de Mongoose)
// Tipado para crear orden desde frontend
export type CreateOrderDTO = Omit<
  IOrder,
  keyof Document | "createdAt" | "updatedAt" | "items"
> & {
  items: CartItemDTO[];
};
