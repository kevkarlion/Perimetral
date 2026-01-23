// /backend/lib/controllers/orderController.ts
import { NextResponse } from "next/server";
import type { CreateOrderDTO, OrderResponse } from "@/types/orderTypes";
import { OrderService } from "@/backend/lib/services/orderServices";

export class OrderController {
  static async createOrder(req: Request): Promise<NextResponse> {
    try {
      const body: CreateOrderDTO = await req.json(); // Tipado limpio

      // Delegamos toda la lógica al servicio
      const order: OrderResponse = await OrderService.createOrder(body);

      return NextResponse.json(order, { status: 201 });
    } catch (error: any) {
      console.error("❌ Error en OrderController.createOrder:", error);
      return NextResponse.json(
        { error: error.message || "Error al crear la orden" },
        { status: 400 }
      );
    }
  }
}
