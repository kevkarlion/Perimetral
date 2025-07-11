import { Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  variationId?: string;
  medida?: string;
}

export interface ICustomerData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface IOrder extends Document {
  customer: ICustomerData;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: string;
  paymentDetails?: any;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = IOrder['status'];
export type PaymentMethod = IOrder['paymentMethod'];