// types/orderTypes.ts
import { Types } from "mongoose";
import { IOrder as IOrderModel } from "@/backend/lib/models/Order";

// -----------------------------
// Interfaces y tipos existentes
// -----------------------------
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
  expirationDate?: Date;
  isCashPayment?: boolean;
  [key: string]: any;
}

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

export interface IOrder {
  _id: string;
  orderNumber: string;
  accessToken: string;
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
  notes?: string;
  discount: number; // 🔹 obligatorio para TS
  createdAt: Date;
  updatedAt: Date;
  stockDiscounted?: boolean; // 🔹 Agregar aquí
}

// -----------------------------
// Mapper centralizado
// -----------------------------
export function mapOrderToDTO(order: IOrderModel): IOrder {
  return {
    _id: (order._id as Types.ObjectId).toString(),
    orderNumber: order.orderNumber,
    accessToken: order.accessToken,
    customer: order.customer,
    items: order.items.map((i) => ({
      productId: i.productId,
      variationId: i.variationId!,
      name: i.name,
      quantity: i.quantity,
      price: i.price,
      image: i.image,
      medida: i.medida,
      sku: i.sku,
    })),
    total: order.total,
    subtotal: order.subtotal || 0,
    vat: order.vat || 0,
    shippingCost: order.shippingCost,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentDetails: order.paymentDetails
      ? {
          ...order.paymentDetails,
          method: (order.paymentDetails.method || "mercadopago") as
            | "mercadopago"
            | "transferencia"
            | "efectivo"
            | "tarjeta",
        }
      : undefined,
    notes: order.notes || "",
    discount: order.discountPercentage || 0,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

// -----------------------------
// Otros tipos
// -----------------------------
export interface CreateOrderDTO extends Omit<IOrder, "_id" | "createdAt" | "updatedAt" | "items"> {
  items: {
    productId: string;
    variationId?: string;
    quantity: number;
  }[];
}

export interface OrderResponse {
  success: boolean;
  order: IOrder;
  paymentUrl?: string;
  error?: string;
}
