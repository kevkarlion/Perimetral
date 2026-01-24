//api/orders/[token]/route.ts
import { NextResponse } from "next/server";
import { OrderService } from "@/backend/lib/services/orderServices";
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";


await dbConnect();
type Params = {
  params: { token: string };
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params; // 👈 importante
    const body = await req.json();
    console.log("🔵 Actualizando orden con token:", token, "y body:", body);
    const order = await OrderService.completeOrder(token, body);
    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("❌ Error actualizando orden:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
