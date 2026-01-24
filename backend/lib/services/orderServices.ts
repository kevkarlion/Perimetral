import mongoose, { Types } from "mongoose";
import Order from "@/backend/lib/models/Order";
import type { CreateOrderDTO, OrderResponse, IOrder } from "@/types/orderTypes";
import { validateCartItems } from "@/backend/lib/herlpers/cartHelpers";
import { calculateTotals } from "@/backend/lib/herlpers/totalsHelpers";
import { MercadoPagoService } from "@/backend/lib/services/mercadoPago.services";
import { StockService } from "@/backend/lib/services/stockService";

export class OrderService {
  static async createOrder(data: CreateOrderDTO): Promise<OrderResponse> {
    // 1️⃣ Validar carrito contra DB (strings)
    const validatedItems = await validateCartItems(data.items);

    // 2️⃣ Totales (con precios reales)
    const { subtotal, iva } = calculateTotals(validatedItems);

    const total =
      subtotal + iva + (data.shippingCost || 0) - (data.discount || 0);

    // 3️⃣ Normalizar IDs para Mongo
    const dbItems = validatedItems.map((item) => ({
      ...item,
      productId: new Types.ObjectId(item.productId),
      variationId: item.variationId
        ? new Types.ObjectId(item.variationId)
        : undefined,
    }));

    // 4️⃣ Crear orden (sin pisar fields)
    const order: IOrder = new Order({
      customer: data.customer,
      items: dbItems,
      subtotal,
      vat: iva,
      total,
      shippingCost: data.shippingCost || 0,
      discount: data.discount || 0,
      paymentMethod: data.paymentMethod,
      status: "pending",
      orderNumber: `ORD-${Date.now()}`,
      accessToken: Math.random().toString(36).substring(2, 10),
    });

    await order.save();

    let paymentUrl: string | undefined;

    // 5️⃣ MercadoPago
    if (data.paymentMethod === "mercadopago") {
      const preference = await MercadoPagoService.createPreference(order);

      order.paymentDetails = {
        method: "mercadopago",
        status: "pending",
        mercadopagoPreferenceId: preference.id,
        paymentUrl: preference.init_point,
      };

      order.status = "pending_payment";
      await order.save();

      paymentUrl = preference.init_point;
    }

    return {
      success: true,
      order,
      paymentUrl,
    };
  }

  // Completar orden por webhook o patch
static async completeOrder(
  token: string,
  data: { status: string; additionalData?: any },
) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findOne({ accessToken: token }).session(session);
    if (!order) throw new Error("Orden no encontrada");
    if (order.status === "completed") return order; // idempotencia

    // Descontar stock
    await StockService.discountFromOrder(order);

    // Actualizar estado
    order.status = data.status;

    // Actualizar notas y paymentDetails
    if (data.additionalData) {
      const { notes, ...paymentData } = data.additionalData;

      if (Object.keys(paymentData).length > 0) {
        order.paymentDetails = {
          ...order.paymentDetails,
          ...paymentData,
        };
      }

      if (notes !== undefined) {
        order.notes = notes;
        order.markModified("notes"); // 🔹 asegura que se guarde
      }
    }

    await order.save({ session });
    await session.commitTransaction();
    return order;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

  static async listOrders() {
    // Trae todas las órdenes ordenadas por creación
    return Order.find().sort({ createdAt: -1 }).lean();
  }
}
