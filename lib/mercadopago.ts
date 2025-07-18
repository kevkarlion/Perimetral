// lib/mercadoPago.ts
import { MercadoPagoConfig } from 'mercadopago';
const tokenAccess = process.env.MP_ACCESS_TOKEN;

console.log('🔑 Token de acceso de MercadoPago:', tokenAccess ? 'Cargado' : 'No cargado');
// Configura el cliente reutilizable
const client = new MercadoPagoConfig({
  accessToken: tokenAccess || '',
  options: {
    timeout: 5000,
    idempotencyKey: 'unique-idempotency-key'
  }
});

export { client };