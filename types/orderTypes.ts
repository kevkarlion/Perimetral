import { Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  quantity: number;
  price: number;
  variation?: string;
}

export interface ICustomerData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends Document {
  customer: ICustomerData;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  paymentMethod: 'transferencia' | 'mercadoPago' | 'efectivo';
  createdAt: Date;
}

export type OrderStatus = IOrder['status'];
export type PaymentMethod = IOrder['paymentMethod'];