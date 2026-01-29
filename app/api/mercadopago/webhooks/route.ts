// api/mercadopago/webhooks/route.ts
import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { getClient } from "@/backend/lib/services/mercadoPagoPayment";
import { sendEmail } from "@/backend/lib/services/email.service";
import { completedOrderEmail } from "@/backend/lib/email/orderConfirmationEmail";
import { OrderService } from "@/backend/lib/services/orderServices";

import type { MercadoPagoPayment, WebhookResponse } from "@/types/mercadopagoTypes";

// ----------------------------
// Parseo seguro del pago
// ----------------------------
function parsePaymentData(paymentData: any): MercadoPagoPayment {
  if (typeof paymentData?.id !== "number") throw new Error("ID de pago inválido");
  if (typeof paymentData?.status !== "string") throw new Error("Estado de pago inválido");

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
export async function POST(request: Request): Promise<NextResponse<WebhookResponse>> {
  try {
    const rawBody = await request.text();
    if (!rawBody) return NextResponse.json({ success: true });

    const body = JSON.parse(rawBody);
    console.log("🔔 Webhook recibido:", body);

    const topic = body.topic || body.type || body.action;
    console.log("🧪 Topic recibido:", topic);

    const client = getClient();
    let paymentDetails: MercadoPagoPayment | null = null;

    // ============================
    // 🔹 CASO 1: merchant_order
    // ============================
    if (topic === "merchant_order" && body.resource) {
      const merchantOrderId = body.resource.split("/").pop();
      console.log("📦 Merchant order ID:", merchantOrderId);

      const merchantOrder = await fetch(
        `https://api.mercadolibre.com/merchant_orders/${merchantOrderId}`,
        { headers: { Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` } }
      ).then((res) => res.json());

      console.log("📦 Merchant order data:", merchantOrder);

      const approvedPayment = merchantOrder.payments?.find((p: any) => p.status === "approved");
      if (!approvedPayment) {
        console.log("⏳ No hay pagos aprobados todavía");
        return NextResponse.json({ success: true });
      }

      paymentDetails = {
        id: approvedPayment.id,
        status: approvedPayment.status,
        transaction_amount: approvedPayment.transaction_amount,
        payment_method_id: approvedPayment.payment_method_id,
        external_reference: merchantOrder.external_reference,
      };
    }

    // ============================
    // 🔹 CASO 2: payment / payment.updated
    // ============================
    if ((topic === "payment" || topic === "payment.updated") && body?.data?.id) {
      const payment = new Payment(client);
      const rawPayment = await payment.get({ id: body.data.id });
      paymentDetails = parsePaymentData(rawPayment);
    }

    // ============================
    // 🔹 Nada procesable
    // ============================
    if (!paymentDetails) {
      console.log("⚠️ Webhook ignorado (sin datos útiles)");
      return NextResponse.json({ success: true });
    }

    // ============================
    // 🔹 Solo pagos aprobados
    // ============================
    if (paymentDetails.status !== "approved") {
      console.log("⏳ Pago no aprobado:", paymentDetails.status);
      return NextResponse.json({ success: true });
    }

    const orderToken = paymentDetails.external_reference;
    if (!orderToken) {
      console.error("❌ Pago sin external_reference");
      return NextResponse.json({ success: false, error: "Orden sin external_reference" }, { status: 400 });
    }

    // ============================
    // 🔹 Obtener orden desde OrderService con retry por si llega antes de guardarse
    // ============================
    let order;
    try {
      order = await OrderService.getOrderByToken(orderToken);
    } catch {
      console.warn(`Orden ${orderToken} no encontrada, reintentando en 3s...`);
      await new Promise((r) => setTimeout(r, 3000));
      order = await OrderService.getOrderByToken(orderToken);
    }
    console.log("📦 Orden encontrada:", order.orderNumber);

    // ============================
    // 🔹 Actualizar orden a completed
    // ============================
    const updatedOrder = await OrderService.updateOrder(orderToken, {
      status: "completed",
      additionalData: {
        paymentStatus: paymentDetails.status,
        paymentId: paymentDetails.id.toString(),
        paidAmount: paymentDetails.transaction_amount,
        paymentMethod: paymentDetails.payment_method_id,
      },
    });
    console.log(`✅ Orden ${orderToken} actualizada a estado: completed`);

    // ============================
    // 🔹 Enviar mail de orden completada
    // ============================
    await sendEmail({
      to: updatedOrder.customer.email,
      subject: `Pago confirmado - Pedido ${updatedOrder.orderNumber}`,
      html: completedOrderEmail({
        orderNumber: updatedOrder.orderNumber,
        total: paymentDetails.transaction_amount,
        accessToken: updatedOrder.accessToken,
      }),
    });
    console.log("✉️ Mail de orden completada enviado");

    return NextResponse.json({ success: true, orderToken });
  } catch (error) {
    console.error("❌ Error en webhook:", error);
    return NextResponse.json({ success: false, error: "Error procesando webhook" }, { status: 500 });
  }
}
