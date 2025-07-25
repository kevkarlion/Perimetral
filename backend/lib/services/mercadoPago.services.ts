import { Preference } from 'mercadopago';
import { client } from '@/lib/mercadopago';

export class MercadoPagoService {
  static async createPreference(order: any) {
    try {
      const preference = new Preference(client);
      
      // Mapeo básico de items (manteniendo tu estructura)
      const items = order.items.map((item: any) => ({
        title: item.name, // Solo el campo obligatorio
        unit_price: Number(item.price), // Convertido a número
        quantity: Number(item.quantity), // Convertido a número
        currency_id: 'ARS' // Moneda obligatoria
      }));

      // Configuración MÍNIMA con tus datos
      const response = await preference.create({
        body: {
          items: items,
          payer: {
            email: order.customer.email // Email obligatorio
          },
          // back_urls básicas (puedes comentarlas inicialmente)
          // back_urls: {
          //   success: 'http://localhost:3000/payment/success',
          //   failure: 'http://localhost:3000/payment/failure'
          // }
        }
      });

      return {
        id: response.id,
        init_point: response.init_point || (response as any).sandbox_init_point
      };
    } catch (error: any) {
      console.error('Error básico MercadoPago:', {
        status: error.status,
        message: error.message
      });
      throw error;
    }
  }
}