import { NextResponse } from "next/server";
import type { CreateOrderDTO, OrderResponse } from "@/types/orderTypes";
import { OrderService } from "@/backend/lib/services/orderServices";

export class OrderController {
  static async createOrder(req: Request): Promise<NextResponse> {
    try {
      const body: CreateOrderDTO = await req.json();
      const order: OrderResponse = await OrderService.createOrder(body);
      return NextResponse.json(order, { status: 201 });
    } catch (error: any) {
      console.error("❌ Error en OrderController.createOrder:", error);
      return NextResponse.json({ error: error.message || "Error al crear la orden" }, { status: 400 });
    }
  }

  static async listOrders(req: Request): Promise<NextResponse> {
    try {
      const orders = await OrderService.listOrders();
      return NextResponse.json({ success: true, orders }, { status: 200 });
    } catch (error: any) {
      console.error("❌ Error en OrderController.listOrders:", error);
      return NextResponse.json({ error: error.message || "Error al listar órdenes" }, { status: 400 });
    }
  }

  // Nueva función para actualizar cualquier propiedad de la orden
  static async updateOrder(req: Request, token: string): Promise<NextResponse> {
    try {
      const body = await req.json();
      const order = await OrderService.updateOrder(token, body);
      return NextResponse.json({ success: true, order }, { status: 200 });
    } catch (error: any) {
      console.error("❌ Error en OrderController.updateOrder:", error);
      return NextResponse.json({ error: error.message || "Error actualizando orden" }, { status: 400 });
    }
  }
}
