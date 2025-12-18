import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { getClient } from "@/backend/lib/services/mercadoPagoPayment";

import type {
  MercadoPagoPayment,
  WebhookResponse,
} from "@/types/mercadopagoTypes";

// ----------------------------
// Parseo seguro del pago
// ----------------------------
function parsePaymentData(paymentData: any): MercadoPagoPayment {
  if (typeof paymentData?.id !== "number") {
    throw new Error("ID de pago inválido");
  }

  if (typeof paymentData?.status !== "string") {
    throw new Error("Estado de pago inválido");
  }

  return {
    id: paymentData.id,
    status: paymentData.status,
    transaction_amount: paymentData.transaction_amount || 0,
    payment_method_id: paymentData.payment_method_id,
    external_reference: paymentData.external_reference,
  };
}

// ----------------------------
// Webhook
// ----------------------------
export async function POST(
  request: Request
): Promise<NextResponse<WebhookResponse>> {
  try {
    const rawBody = await request.text();
    if (!rawBody) return NextResponse.json({ success: true });

    const body = JSON.parse(rawBody);
    console.log("🔔 Webhook recibido:", body);

    // Solo procesamos payment.updated
    if (body.action !== "payment.updated") {
      return NextResponse.json({ success: true });
    }

    if (!body?.data?.id) {
      return NextResponse.json(
        { success: false, error: "ID de pago faltante" },
        { status: 400 }
      );
    }

    // Obtener pago desde MP
    const client = getClient();
    const payment = new Payment(client);

    const rawPayment = await payment.get({ id: body.data.id });
    const paymentDetails = parsePaymentData(rawPayment);

    // Solo cuando está aprobado
    if (paymentDetails.status !== "approved") {
      return NextResponse.json({ success: true });
    }

    const orderToken = paymentDetails.external_reference;

    if (!orderToken) {
      return NextResponse.json(
        { success: false, error: "Orden sin external_reference" },
        { status: 400 }
      );
    }

    // 🛒 Limpiar carrito
    await fetch(`${process.env.BASE_URL}/api/cart/clear`, {
      method: "POST",
    });

    // ✅ ACÁ ESTÁ LA CLAVE:
    // delegamos TODO a la ruta de órdenes
    await fetch(`${process.env.BASE_URL}/api/orders/${orderToken}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "completed",
        additionalData: {
          paymentStatus: paymentDetails.status,
          paymentId: paymentDetails.id.toString(),
          paidAmount: paymentDetails.transaction_amount,
          paymentMethod: paymentDetails.payment_method_id,
        },
      }),
    });

    return NextResponse.json({
      success: true,
      orderToken,
    });
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    return NextResponse.json(
      { success: false, error: "Error procesando webhook" },
      { status: 500 }
    );
  }
}
