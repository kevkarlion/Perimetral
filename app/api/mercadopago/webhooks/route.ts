import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { getClient } from "@/backend/lib/services/mercadoPagoPayment";
import { OrderService } from "@/backend/lib/services/order.services";

import type {
  MercadoPagoPayment,
  WebhookResponse,
} from "@/types/mercadopagoTypes";

// Función para validar y convertir los datos del pago
function parsePaymentData(paymentData: any): MercadoPagoPayment {
  if (typeof paymentData?.id !== "number") {
    throw new Error("ID de pago inválido o faltante");
  }

  if (typeof paymentData?.status !== "string") {
    throw new Error("Estado de pago inválido o faltante");
  }

  return {
    id: paymentData.id,
    status: paymentData.status,
    status_detail: paymentData.status_detail,
    transaction_amount: paymentData.transaction_amount || 0,
    date_approved: paymentData.date_approved,
    payment_method_id: paymentData.payment_method_id,
    payment_type_id: paymentData.payment_type_id,
    external_reference: paymentData.external_reference,
  };
}

export async function POST(
  request: Request
): Promise<NextResponse<WebhookResponse>> {
  try {
    const rawBody = await request.text();

    // Webhooks de MP a veces vienen vacíos (reintentos)
    if (!rawBody) {
      return NextResponse.json({ success: true });
    }

    const body = JSON.parse(rawBody);

    console.log("Webhook recibido:", body);

    // 👉 SOLO procesamos el segundo aviso
    // payment.created -> ignorar
    // payment.updated -> procesar
    if (body.action !== "payment.updated") {
      return NextResponse.json({ success: true });
    }

    if (!body?.data?.id) {
      return NextResponse.json(
        { success: false, error: "Datos de webhook inválidos" },
        { status: 400 }
      );
    }

    const client = getClient();
    const payment = new Payment(client);

    console.log("Obteniendo detalles del pago para ID:", body.data.id);

    const rawPaymentData = await payment.get({ id: body.data.id });
    const paymentDetails = parsePaymentData(rawPaymentData);

    // 👉 SOLO cuando Mercado Pago confirma APPROVED
    if (paymentDetails.status !== "approved") {
      return NextResponse.json({ success: true });
    }

    const orderId = paymentDetails.external_reference;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "No se encontró referencia de orden" },
        { status: 400 }
      );
    }

    // ✅ ÚNICA acción de negocio del webhook
    // El stock se descuenta INTERNAMENTE cuando la orden pasa a completed
    await OrderService.updateOrderStatus(orderId, "completed", {
      paymentStatus: paymentDetails.status,
      paymentId: paymentDetails.id.toString(),
      paidAmount: paymentDetails.transaction_amount,
      paymentMethod: paymentDetails.payment_method_id,
    });

    return NextResponse.json({
      success: true,
      orderId,
    });
  } catch (error: any) {
    console.error("Error en webhook:", error);
    return NextResponse.json(
      { success: false, error: "Error procesando el webhook" },
      { status: 500 }
    );
  }
}
