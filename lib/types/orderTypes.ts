import { Document, Types } from 'mongoose';

export interface IOrderItem {
  productId: string | Types.ObjectId;
  variationId?: string | Types.ObjectId;
  name: string;
  quantity: number;
  price: number;         // Precio unitario SIN IVA
  priceWithVat?: number; // Precio unitario CON IVA (calculado)
  image?: string;
  medida?: string;
  sku?: string;          // Nuevo campo para referencia
}

export interface ICustomerData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dni?: string;          // Nuevo campo opcional para facturación
}

export interface IPaymentDetails {
  method: 'mercadopago' | 'transferencia' | 'efectivo' | 'tarjeta';
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  transactionId?: string;
  mercadopagoPreferenceId?: string;
  paymentUrl?: string;
  approvedAt?: Date;
  // Mantener compatibilidad con tu paymentDetails any
  [key: string]: any;
}

export interface IOrder extends Document {
  customer: ICustomerData;
  items: IOrderItem[];
  subtotal: number;      // Nuevo campo: suma de precios SIN IVA
  vat: number;           // Nuevo campo: monto de IVA calculado
  total: number;
  shippingCost?: number; // Nuevo campo opcional
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'; // Estados ampliados
  paymentMethod: string; // Mantenido para compatibilidad
  paymentDetails?: IPaymentDetails; // Reemplaza el tipo 'any'
  notes?: string;        // Nuevo campo para notas
  createdAt: Date;
  updatedAt: Date;
}

// Tipos derivados (manteniendo los existentes)
export type OrderStatus = IOrder['status'];
export type PaymentMethod = IOrder['paymentMethod'];

// Tipos para respuesta de API
export interface OrderResponse {
  success: boolean;
  order: IOrder;
  paymentUrl?: string;
  error?: string;
}

// Tipo para crear nuevas órdenes (sin campos de Mongoose)
export type CreateOrderDTO = Omit<IOrder, keyof Document | 'createdAt' | 'updatedAt'> & {
  items: Array<Omit<IOrderItem, 'priceWithVat'>>; // priceWithVat se calcula en el backend
};