import { Schema, model, Document } from 'mongoose';

interface IOrderItem {
  productId: string;
  quantity: number;
  price: number;
  variation?: string; // Ej: "1.50 × 10m"
}

interface IOrder extends Document {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  paymentMethod: 'transferencia' | 'mercadoPago' | 'efectivo';
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: [{
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    variation: { type: String }
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'paid', 'shipped', 'cancelled'] },
  paymentMethod: { type: String, required: true, enum: ['transferencia', 'mercadoPago', 'efectivo'] },
  createdAt: { type: Date, default: Date.now }
});

export default model<IOrder>('Order', OrderSchema);