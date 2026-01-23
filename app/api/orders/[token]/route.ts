// // app/api/orders/route.ts
// import { NextResponse } from "next/server";
// import { createOrderController } from "@/backend/lib/controllers/orderController";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const order = await createOrderController(body);

//     return NextResponse.json(order, { status: 201 });
//   } catch (error: any) {
//     console.error("❌ Error en /api/orders:", error);
//     return NextResponse.json(
//       { error: error.message || "Error al crear la orden" },
//       { status: 400 }
//     );
//   }
// }

// export const dynamic = "force-dynamic";
