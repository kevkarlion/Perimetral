import { NextResponse } from "next/server";
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import { OrderService } from "@/backend/lib/services/orderServices";

await dbConnect();

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { notes } = await req.json();

    if (typeof notes !== "string") {
      return NextResponse.json(
        { error: "Notas inválidas" },
        { status: 400 }
      );
    }

    const order = await OrderService.updateNotes(token, notes);

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error("❌ Error actualizando notas:", error);
    return NextResponse.json(
      { error: error.message || "Error actualizando notas" },
      { status: 400 }
    );
  }
}

export const dynamic = "force-dynamic";
