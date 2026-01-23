import { Types } from "mongoose";
import  Order  from "@/backend/lib/models/Order";
import type { CreateOrderDTO, OrderResponse, IOrder } from "@/types/orderTypes";

export class OrderService {
  static async createOrder(data: CreateOrderDTO): Promise<OrderResponse> {
    // Convertir IDs a ObjectId
    const items = data.items.map(item => ({
      ...item,
      productId: new Types.ObjectId(item.productId),
      variationId: item.variationId ? new Types.ObjectId(item.variationId) : undefined,
    }));

    // Calcular totales
    const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const vat = subtotal * 0.21; // ejemplo 21%
    const total = subtotal + vat + (data.shippingCost || 0) - (data.discount || 0);

    // Crear la orden
    const order: IOrder = new Order({
      ...data,
      items,
      subtotal,
      vat,
      total,
      status: "pending",
      orderNumber: `ORD-${Date.now()}`,
      accessToken: Math.random().toString(36).substring(2, 10),
    });

    await order.save();

    return { success: true, order };
  }
}
