// services/orderServices.ts
import mongoose, { Types } from "mongoose";

import type { CreateOrderDTO, OrderResponse } from "@/types/orderTypes";
import { validateCartItems } from "@/backend/lib/herlpers/cartHelpers";
import { calculateTotals, CartItem } from "@/backend/lib/herlpers/totalsHelpers";
import { MercadoPagoService } from "@/backend/lib/services/mercadoPago.services";
import { StockService } from "@/backend/lib/services/stockService";
import Order, { IOrder as IOrderModel } from "@/backend/lib/models/Order";
import { sendEmail } from "@/backend/lib/services/email.service";
import { orderConfirmationEmail } from "@/backend/lib/email/orderConfirmationEmail";
import { IOrder as IOrderDTO, mapOrderToDTO } from "@/types/orderTypes";

export class OrderService {
  // -----------------------------
  // Crear orden
  // -----------------------------
  static async createOrder(data: CreateOrderDTO): Promise<OrderResponse> {
    // 1️⃣ Validar carrito
    const validatedItems = await validateCartItems(data.items);

    // 2️⃣ Totales
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

    // 4️⃣ Crear orden
    const order: IOrderModel = new Order({
      customer: data.customer,
      items: dbItems,
      subtotal,
      vat: iva,
      total,
      shippingCost: data.shippingCost || 0,
      discountPercentage: data.discount || 0,
      paymentMethod: data.paymentMethod,
      status: "pending",
      orderNumber: `ORD-${Date.now()}`,
      accessToken: Math.random().toString(36).substring(2, 10),
    });

    await order.save();

    let paymentUrl: string | undefined;

    if (data.paymentMethod === "mercadopago") {
      const preference = await MercadoPagoService.createPreference(order);

      order.paymentDetails = {
        method: "mercadopago",
        status: "pending",
        mercadopagoPreferenceId: preference.id,
        paymentUrl: preference.init_point,
      };

      await order.save();
      paymentUrl = preference.init_point;
    } else {
      // Envío de mail inmediato para efectivo/transferencia
      await sendEmail({
        to: order.customer.email,
        subject: `Pedido #${order.orderNumber} recibido`,
        html: orderConfirmationEmail(mapOrderToDTO(order)),
      });
    }

    // ✅ Devolver DTO plano
    return {
      success: true,
      order: mapOrderToDTO(order),
      paymentUrl,
    };
  }

  // -----------------------------
  // Actualizar orden
  // -----------------------------
  static async updateOrder(
    token: string,
    data: {
      notes?: string;
      status?: string;
      discountPercentage?: number;
      items?: CartItem[];
      additionalData?: any;
    },
  ): Promise<IOrderDTO> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findOne({ accessToken: token }).session(session);
      if (!order) throw new Error("Orden no encontrada");

      // 1️⃣ Notas
      if (data.notes !== undefined) order.notes = data.notes;

      // 2️⃣ Descuento y recalculo
      if (data.discountPercentage !== undefined || data.items) {
        const itemsToCalculate: CartItem[] = data.items || order.items;

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
      }

      // 3️⃣ Estado y descuento de stock
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

        if (data.status === "completed") {
          const updatedOrder = await Order.findOneAndUpdate(
            {
              accessToken: token,
              stockDiscounted: false,
            },
            {
              $set: { status: "completed", stockDiscounted: true },
            },
            { new: true, session },
          );

          if (updatedOrder) {
            await StockService.discountFromOrder(updatedOrder);
            console.log(
              `✅ Stock descontado para orden ${updatedOrder.orderNumber}`,
            );
          } else {
            console.log(`⚠️ Stock ya descontado o orden no encontrada`);
          }
        } else {
          order.status = data.status;
        }
      }

      await order.save({ session });
      await session.commitTransaction();

      return mapOrderToDTO(order);
    } catch (err) {
      await session.abortTransaction();
      console.error("❌ Error en updateOrder:", err);
      throw err;
    } finally {
      session.endSession();
    }
  }

  // -----------------------------
  // Obtener orden por token
  // -----------------------------
  static async getOrderByToken(token: string): Promise<IOrderDTO> {
    const order = await Order.findOne({ accessToken: token });
    if (!order) throw new Error("Orden no encontrada");

    return mapOrderToDTO(order);
  }

  // -----------------------------
  // Listar órdenes
  // -----------------------------
  static async listOrders(): Promise<IOrderDTO[]> {
    const orders = await Order.find().sort({ createdAt: -1 });
    return orders.map(mapOrderToDTO);
  }

  // -----------------------------
  // Completar orden
  // -----------------------------
  static async completeOrder(
    token: string,
    data: { status: string; additionalData?: any },
  ): Promise<IOrderDTO> {
    return this.updateOrder(token, { ...data, status: "completed" });
  }
}
