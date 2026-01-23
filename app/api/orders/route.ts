//api/orders/route.ts
import { NextResponse } from "next/server";
import type { CreateOrderDTO, OrderResponse } from "@/types/orderTypes";
import { OrderService } from "@/backend/lib/services/orderServices";

export async function POST(req: Request) {
  try {
    const body: CreateOrderDTO = await req.json(); // Tipado limpio

    // Delegamos todo al servicio
    const order: OrderResponse = await OrderService.createOrder(body);

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error en /api/orders:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear la orden" },
      { status: 400 }
    );
  }
}

export const dynamic = "force-dynamic";
