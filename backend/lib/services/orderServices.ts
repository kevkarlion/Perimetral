import mongoose, { Types } from "mongoose";
import Order from "@/backend/lib/models/Order";
import type { CreateOrderDTO, OrderResponse, IOrder } from "@/types/orderTypes";
import { validateCartItems } from "@/backend/lib/herlpers/cartHelpers";
import {
  calculateTotals,
  CartItem,
} from "@/backend/lib/herlpers/totalsHelpers";
import { MercadoPagoService } from "@/backend/lib/services/mercadoPago.services";
import { StockService } from "@/backend/lib/services/stockService";

import { sendEmail } from "@/backend/lib/services/email.service";
import { orderConfirmationEmail } from "@/backend/lib/email/orderConfirmationEmail";

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


    //mail cuando el estado es pending_payment
    if (order.status === "pending_payment") {
      await sendEmail({
        to: order.customer.email,
        subject: `Pedido #${order.orderNumber} recibido - pendiente de pago`,
        html: orderConfirmationEmail(order),
      });
    }

    return {
      success: true,
      order,
      paymentUrl,
    };
  }

  // En OrderService

  static async updateOrder(
    token: string,
    data: {
      notes?: string;
      status?: string;
      discountPercentage?: number;
      items?: CartItem[]; // Pasamos items si queremos recalcular total
      additionalData?: any;
    },
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const order = await Order.findOne({ accessToken: token }).session(
        session,
      );
      if (!order) throw new Error("Orden no encontrada");

      // --- 1. Manejo de notas ---
      if (data.notes !== undefined) order.notes = data.notes;

      // --- 2. Manejo de descuento ---
      if (data.discountPercentage !== undefined || data.items) {
        const itemsToCalculate: CartItem[] = data.items || order.items;

        // Si ya hay totalBeforeDiscount y se intenta cambiar descuento > 0, no aplicamos otro
        if (
          order.totalBeforeDiscount &&
          data.discountPercentage! > 0 &&
          data.discountPercentage !== order.discountPercentage
        ) {
          throw new Error(
            "El descuento ya fue aplicado previamente. No se puede aplicar otro.",
          );
        }

        const totals = calculateTotals(
          itemsToCalculate,
          data.discountPercentage || 0,
          order.totalBeforeDiscount,
        );

        order.subtotal = totals.subtotal;
        order.vat = totals.iva;
        order.totalBeforeDiscount = totals.totalBeforeDiscount;
        order.discountPercentage = data.discountPercentage || 0;
        order.total = totals.total;

        // Guardamos los resultados en la orden
        order.subtotal = totals.subtotal;
        order.vat = totals.iva;
        order.totalBeforeDiscount = totals.totalBeforeDiscount;
        order.discountPercentage = data.discountPercentage || 0;
        order.total = totals.total;
      }

      // --- 3. Manejo del estado ---
      if (data.status !== undefined) {
        const validStatuses = [
          "pending",
          "pending_payment",
          "processing",
          "completed",
          "payment_failed",
          "cancelled",
        ];
        if (!validStatuses.includes(data.status))
          throw new Error("Estado no válido");

        const isCompletingOrder =
          data.status === "completed" && order.status !== "completed";
        if (order.status !== data.status) {
          order.status = data.status;
          if (isCompletingOrder) {
            await StockService.discountFromOrder(order);
          }
        }
      }

      // --- 4. Guardar cambios ---
      await order.save({ session });
      await session.commitTransaction();
      return order;
    } catch (err) {
      await session.abortTransaction();
      console.error("❌ Error en updateOrder:", err);
      throw err;
    } finally {
      session.endSession();
    }
  }

  // Puedes eliminar completeOrder o dejarla como wrapper para mantener compatibilidad
  static async completeOrder(
    token: string,
    data: { status: string; additionalData?: any },
  ) {
    // Wrapper para mantener compatibilidad con código existente
    return this.updateOrder(token, { ...data, status: "completed" });
  }

  static async listOrders() {
    // Trae todas las órdenes ordenadas por creación
    return Order.find().sort({ createdAt: -1 }).lean();
  }

  static async getOrderByToken(token: string) {
    const order = await Order.findOne({ accessToken: token }).lean();
    if (!order) throw new Error("Orden no encontrada");
    return order;
  }
}
