// lib/mercadoPago.ts
import { MercadoPagoConfig } from 'mercadopago';

// Configura el cliente reutilizable
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: {
    timeout: 5000,
    idempotencyKey: 'unique-idempotency-key'
  }
});

export { client };