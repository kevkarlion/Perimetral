// app/api/orders/[token]/route.ts
import { NextResponse } from "next/server";
import { OrderService } from "@/backend/lib/services/orderServices";
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";

await dbConnect();

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await req.json();

  console.log("🔵 PATCH recibido para token:", token);
  console.log("🔵 Body:", body);

  try {
    // Siempre usamos updateOrder que maneja toda la lógica
    const order = await OrderService.updateOrder(token, body);

    return NextResponse.json({ 
      success: true, 
      order,
      message: "Orden actualizada exitosamente" 
    });
    
  } catch (error: any) {
    console.error("❌ Error actualizando orden:", error);
    
    // Mensajes de error más específicos
    let errorMessage = error.message || "Error actualizando orden";
    let statusCode = 400;
    
    if (error.message.includes("no encontrada")) {
      statusCode = 404;
    } else if (error.message.includes("no válido")) {
      statusCode = 422;
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      }, 
      { status: statusCode }
    );
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  try {
    const order = await OrderService.getOrderByToken(token);
    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("❌ Error obteniendo orden:", error);
    let status = 400;
    if (error.message.includes("no encontrada")) status = 404;
    return NextResponse.json(
      { success: false, error: error.message },
      { status }
    );
  }
}

export const dynamic = "force-dynamic";