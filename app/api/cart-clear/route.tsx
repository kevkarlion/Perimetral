// app/api/cart/clear/route.ts
import { NextResponse } from "next/server";
import { useCartStore } from "@/app/components/store/cartStore";

const { clearCart } = useCartStore();

export async function POST(request: Request) {
  try {
    const authToken = request.headers.get("Authorization");
    if (authToken !== `Bearer ${process.env.API_SECRET}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    // Limpiar el carrito usando la función de tu store
    clearCart();

    return NextResponse.json({
      success: true,
      message: "Carrito limpiado exitosamente",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Error al limpiar el carrito",
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
