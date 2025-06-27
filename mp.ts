import 'dotenv/config'; // ✅ Esto carga automáticamente el archivo .env



// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
// Agrega credenciales
const accessToken = process.env.NEXT_PROD_TOKEN_MP;
if (!accessToken) {
  throw new Error('MercadoPago access token (NEXT_PROD_TOKEN_MP) is not defined in environment variables.');
}
const client = new MercadoPagoConfig({ accessToken });
