import mongoose, { Document, Schema, Types } from 'mongoose';
import crypto from 'crypto';

// Interfaces sin export individual
interface IOrderItem {
  productId: Types.ObjectId;
  variationId?: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  medida?: string;
  sku?: string;
}

interface ICustomerData {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dni?: string;
}

interface IPaymentDetails {
  status: 'pending' | 'approved' | 'rejected' | 'refunded';
  method?: 'mercadopago' | 'transferencia' | 'efectivo' | 'tarjeta';
  transactionId?: string;
  mercadopagoPreferenceId?: string;
  paymentUrl?: string;
  approvedAt?: Date;
  expirationDate?: Date; // Para pagos en efectivo
  [key: string]: any;
}

// Interface principal exportada
export interface IOrder extends Document {
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
  notes?: string; // 🔹 Nuevo campo para anotaciones
  createdAt: Date;
  updatedAt: Date;
}

// Schema
const orderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      default: () =>
        `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 100)}`
    },
    accessToken: {
      type: String,
      required: true,
      unique: true,
      default: () => crypto.randomBytes(16).toString('hex')
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: String,
      phone: String,
      dni: String
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        variationId: { type: Schema.Types.ObjectId, ref: 'ProductVariation' },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: String,
        medida: String,
        sku: String
      }
    ],
    total: { type: Number, required: true },
    subtotal: Number,
    vat: Number,
    shippingCost: Number,
    status: {
      type: String,
      required: true,
      enum: ['pending', 'pending_payment', 'processing', 'completed', 'payment_failed', 'cancelled'],
      default: 'pending'
    },
    paymentMethod: { type: String, required: true },
    paymentDetails: {
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'refunded'],
        default: 'pending'
      },
      method: String,
      transactionId: String,
      mercadopagoPreferenceId: String,
      paymentUrl: String,
      approvedAt: Date,
      expirationDate: Date
    },
    notes: { type: String, default: "" } // 🔹 Campo para anotaciones simples
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Model export
const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);
export default Order;
