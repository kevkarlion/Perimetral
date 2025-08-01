// lib/mercadoPago.ts
import { MercadoPagoConfig, Payment } from 'mercadopago';
const tokenAccess = process.env.MP_ACCESS_TOKEN;

console.log('🔑 Token de acceso de MercadoPago:', tokenAccess ? 'Cargado' : 'No cargado');

// Configura el cliente
const client = new MercadoPagoConfig({
  accessToken: tokenAccess || '',
  options: {
    timeout: 5000,
    idempotencyKey: 'unique-idempotency-key'
  }
});

// Crea el objeto Payment con la configuración
const payment = new Payment(client);

// Función para verificar el pago
export async function verifyPayment(paymentId: string) {
  try {
    const result = await payment.get({ id: paymentId });
    return result;
  } catch (error) {
    console.error('Error al verificar el pago:', error);
    throw new Error('Error al verificar el pago con MercadoPago');
  }
}

// Exporta también el client por si lo necesitas en otros lugares
export { client };