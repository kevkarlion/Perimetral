//services/mercadoPago.services.ts
import { Preference } from "mercadopago";
import { getClient } from "@/backend/lib/services/mercadoPagoPayment";

const urlFront = process.env.BASE_URL


export class MercadoPagoService {
  static async createPreference(order: any) {
    console.log("order en createPreference", order);
    console.log("🔍 Verificando acceso a rutas...");

    try {
      const client = getClient();
      const preference = new Preference(client);


      // VERIFICAR QUE EL TOTAL INCLUYE IVA
      if (!order.total || order.total <= 0) {
        throw new Error("El total de la orden es inválido: " + order.total);
      }

      // SOLUCIÓN CONFIABLE: Un solo item con el total CON IVA
      const items = [
        {
          title: `Orden #${order.orderNumber}`,
          unit_price: Number(order.total.toFixed(2)), // Total CON IVA
          quantity: 1,
          currency_id: "ARS",
          id: `order_${order.orderNumber}`,
          description: `${order.items.length} producto(s) - Incluye IVA 21%`,
        },
      ];

    
      const orderIdString = order._id.toString
        ? order._id.toString()
        : String(order._id);

      // console.log("orderIdString:", orderIdString);

      const response = await preference.create({
        body: {
          items: items,
          payer: {
            email: order.customer.email,
            name: order.customer.name,
            phone: order.customer.phone
              ? { number: order.customer.phone }
              : undefined,
            address: order.customer.address
              ? {
                  street_name: order.customer.address,
                }
              : undefined,
          },
          external_reference: order.accessToken,
          notification_url: `${urlFront}/api/mercadopago/webhooks`,
          auto_return: "approved",
          back_urls: {
            success: `${urlFront}/pago-exitoso/success?order_id=${orderIdString}`,
            failure: `${urlFront}/pago-fallido/failure?order_id=${orderIdString}`,
            pending: `${urlFront}/pago-pendiente/efectivo?order_id=${orderIdString}`,
          },
          payment_methods: {
            excluded_payment_types: [{ id: "atm" }],
            installments: 12,
          },
          expires: false,
          metadata: {
            store: "tu-tienda",
            internal_order_id: order._id.toString(),
            order_number: order.orderNumber,
            total_with_vat: order.total,
            original_items_count: order.items.length,
            includes_vat: true, // Marcar que incluye IVA
          },
        },
      });

      // console.log("✅ Preferencia de MercadoPago creada exitosamente:", {
      //   preferenceId: response.id,
      //   totalEnviado: order.total,
      //   paymentUrl: response.init_point || (response as any).sandbox_init_point,
      //   sandbox: !!(response as any).sandbox_init_point,
      // });

      return {
        id: response.id,
        init_point: response.init_point || (response as any).sandbox_init_point,
        sandbox: !!(response as any).sandbox_init_point,
        created_date: response.date_created,
        // Para debugging:
        total_processed: order.total,
      };
    } catch (error: any) {
      // console.error("❌ Error creando preferencia de MercadoPago:", {
      //   error: error.message,
      //   status: error.status,
      //   orderId: order?._id,
      //   orderNumber: order?.orderNumber,
      //   total: order?.total,
      //   items: order?.items?.length,
      // });

      // Error más específico para el frontend
      let errorMessage = "Error al procesar el pago con Mercado Pago";

      if (error.status === 401) {
        errorMessage = "Error de configuración con Mercado Pago";
      } else if (error.status === 400) {
        errorMessage = "Datos inválidos para procesar el pago";
      } else if (
        error.message.includes("total") ||
        error.message.includes("price")
      ) {
        errorMessage = "Error en el monto del pago";
      }

      throw new Error(errorMessage);
    }
  }
}
