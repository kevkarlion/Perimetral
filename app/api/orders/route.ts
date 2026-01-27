// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { OrderController } from "@/backend/lib/controllers/orderController";
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";

// Conectamos a la base de datos antes de manejar las solicitudes
await dbConnect();

export async function POST(req: Request) {
  return OrderController.createOrder(req);
}

// GET → listar todas las órdenes
export async function GET(req: Request) {
  return OrderController.listOrders(req);
}

// Indicamos que la ruta es dinámica (Next.js 14)
export const dynamic = "force-dynamic";
