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

  // En OrderService
  static async updateOrder(
    token: string,
    data: {
      notes?: string;
      status?: string;
      discountPercentage?: number;
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
      if (data.notes !== undefined) {
        order.notes = data.notes;
      }
      // --- 2. Manejo de descuento (REVISIÓN COMPLETA) ---
      if (data.discountPercentage !== undefined) {
        const newDiscountPercentage = Math.min(
          Math.max(data.discountPercentage, 0),
          100,
        );
        const currentDiscountPercentage = order.discountPercentage || 0;

        console.log(`💰 === MANEJO DE DESCUENTO ===`);
        console.log(`💰 Descuento actual: ${currentDiscountPercentage}%`);
        console.log(`💰 Descuento nuevo: ${newDiscountPercentage}%`);
        console.log(`💰 Total actual: $${order.total}`);
        console.log(
          `💰 totalBeforeDiscount: ${order.totalBeforeDiscount ? "$" + order.totalBeforeDiscount : "No definido"}`,
        );

        // Guardar el porcentaje de descuento
        order.discountPercentage = newDiscountPercentage;

        // Si hay descuento > 0
        if (newDiscountPercentage > 0) {
          // Determinar el total base para el cálculo
          let baseTotal: number;
          // CASO A: Si ya tenemos totalBeforeDiscount, usarlo
          if (order.totalBeforeDiscount) {
            baseTotal = order.totalBeforeDiscount;
          }
          // CASO B: Si no tenemos totalBeforeDiscount pero el total actual ya tiene descuento
          else if (currentDiscountPercentage > 0) {
            // Revertir el descuento actual para obtener el total original
            baseTotal = Math.round(
              order.total / (1 - currentDiscountPercentage / 100),
            );
            order.totalBeforeDiscount = baseTotal;
          }
          // CASO C: Primer descuento aplicado
          else {
            baseTotal = order.total;
            order.totalBeforeDiscount = baseTotal;
          }
          // Calcular el nuevo total con el descuento
          const discountAmount = Math.round(
            (baseTotal * newDiscountPercentage) / 100,
          );
          const newTotal = baseTotal - discountAmount;
          order.total = newTotal;
        }
        // Si el descuento es 0 (eliminar descuento)
        else {
          // Restaurar al total original si existe totalBeforeDiscount
          if (order.totalBeforeDiscount) {
            order.total = order.totalBeforeDiscount;
            order.totalBeforeDiscount = undefined;
          } else {
            // Si no hay totalBeforeDiscount, recalcular desde subtotal, vat, shipping
            const recalculatedTotal =
              (order.subtotal || 0) +
              (order.vat || 0) +
              (order.shippingCost || 0);
            order.total = recalculatedTotal;
          }
        }
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
        if (!validStatuses.includes(data.status)) {
          throw new Error("Estado no válido");
        }
        const isCompletingOrder =
          data.status === "completed" && order.status !== "completed";
        if (order.status !== data.status) {
          order.status = data.status;

          if (isCompletingOrder) {
            console.log(
              "📦 Orden pasando a 'completed' por primera vez. Descontando stock...",
            );
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
}
