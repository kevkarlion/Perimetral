//services/mercadoPagoPayment.ts
import { MercadoPagoConfig, Payment } from "mercadopago";

// No acceder al token de inmediato
export function getClient() {
  const tokenAccess = process.env.MP_ACCESS_TOKEN;

  if (!tokenAccess) {
    console.warn("⚠️ Token de acceso de MercadoPago no definido");
    throw new Error("Token de acceso de MercadoPago no definido");
  }

  const client = new MercadoPagoConfig({
    accessToken: tokenAccess,
    options: {
      timeout: 5000,
      idempotencyKey: "unique-idempotency-key",
    },
  });

  return client;
}

export async function verifyPayment(paymentId: string) {
  const client = getClient();
  const payment = new Payment(client);

  try {
    const result = await payment.get({ id: paymentId });
    return result;
  } catch (error) {
    console.error("❌ Error al verificar el pago:", error);
    throw new Error("Error al verificar el pago con MercadoPago");
  }
}
