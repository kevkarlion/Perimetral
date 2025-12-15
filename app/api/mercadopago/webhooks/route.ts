// src/app/api/mercadopago/webhooks/route.ts
import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import { getClient } from "@/backend/lib/services/mercadoPagoPayment";
import { OrderService } from "@/backend/lib/services/order.services";

import type {
  MercadoPagoPayment,
  WebhookResponse,
  StockUpdateResult,
  MercadoPagoItem,
} from "@/types/mercadopagoTypes";

// Función para validar y convertir los datos del pago
function parsePaymentData(paymentData: any): MercadoPagoPayment {
  if (typeof paymentData?.id !== "number") {
    throw new Error("ID de pago inválido o faltante");
  }

  if (typeof paymentData?.status !== "string") {
    throw new Error("Estado de pago inválido o faltante");
  }
  //parseo de datos de pago
  return {
    id: paymentData.id,
    status: paymentData.status,
    status_detail: paymentData.status_detail,
    transaction_amount: paymentData.transaction_amount || 0,
    date_approved: paymentData.date_approved,
    payment_method_id: paymentData.payment_method_id,
    payment_type_id: paymentData.payment_type_id,
    external_reference: paymentData.external_reference, // <-- Añade esto
    additional_info: paymentData.additional_info
      ? {
          reference: paymentData.additional_info.reference,
          items: paymentData.additional_info.items?.map(
            (item: MercadoPagoItem) => ({
              id: String(item.id || ""),
              title: item.title,
              description: item.description,
              quantity: Number(item.quantity) || 0,
              unit_price: Number(item.unit_price) || 0,
              variation_id: item.variation_id
                ? String(item.variation_id)
                : undefined,
              category_id: item.category_id
                ? String(item.category_id)
                : undefined,
            })
          ),
          payer: paymentData.additional_info.payer,
        }
      : undefined,
  };
}

export async function POST(
  request: Request
): Promise<NextResponse<WebhookResponse>> {
  try {
    const body = await request.json();
    // Validación básica del webhook
    if (!body?.data?.id) {
      return NextResponse.json(
        { success: false, error: "Datos de webhook inválidos" },
        { status: 400 }
      );
    }
    // Obtener detalles del pago
    const client = getClient();
    const payment = new Payment(client);
    const rawPaymentData = await payment.get({ id: body.data.id });
    const paymentDetails = parsePaymentData(rawPaymentData);

    // Verificar que el pago esté aprobado
    if (paymentDetails.status !== "approved") {
      return NextResponse.json({
        success: true,
        details: `Pago no aprobado, estado: ${paymentDetails.status}`,
      });
    }

    if (paymentDetails.status === "approved") {
      // Limpiar el carrito llamando al endpoint
      const clearResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/cart/clear`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!clearResponse.ok) {
        console.error("Error al limpiar carrito:", await clearResponse.json());
      }
    }
    // Validar información adicional
    // Por esto (usando external_reference):
    const orderId = paymentDetails.external_reference;

    const items = paymentDetails.additional_info?.items || [];

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "No se encontró referencia de orden" },
        { status: 400 }
      );
    }

    // Actualizar estado de la orden
    await OrderService.updateOrderStatus(orderId, "completed", {
      paymentStatus: paymentDetails.status,
      paymentId: paymentDetails.id.toString(),
      paidAmount: paymentDetails.transaction_amount,
      paymentMethod: paymentDetails.payment_method_id,
    });

    // Actualizar stock para cada item
    const stockUpdates: StockUpdateResult[] = [];

    for (const item of items) {
      try {
        if (!item.id) {
          throw new Error("ID de producto faltante");
        }

        const payload: any = {
          productId: item.id,
          stock: -Math.abs(item.quantity), // Valor negativo para disminuir
          action: "increment",
        };

        if (item.variation_id) {
          payload.variationId = item.variation_id;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/stock`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const result = await response.json();

        stockUpdates.push({
          productId: item.id,
          variationId: item.variation_id,
          success: response.ok,
          newStock: result?.data?.stock,
          ...(!response.ok && { error: result.error || "Error desconocido" }),
        });
      } catch (error) {
        stockUpdates.push({
          productId: item.id,
          variationId: item.variation_id,
          success: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
      stockUpdates,
    });
  } catch (error: any) {
    console.error("Error en webhook:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error procesando el webhook",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
