// services/mercadoPago.service.ts
import { Preference } from 'mercadopago';
import { client } from '@/lib/mercadopago';

export class MercadoPagoService {
  static async createPreference(order: any) {
    try {
      const preference = new Preference(client);
      
      const items = order.items.map((item: any) => ({
        id: item.productId,
        title: `${item.name}${item.medida ? ` - ${item.medida}` : ''}`,
        unit_price: item.price,
        quantity: item.quantity,
        picture_url: item.image,
        description: item.medida || undefined,
        currency_id: 'ARS'
      }));

      const response = await preference.create({
        body: {
          items,
          external_reference: order._id.toString(),
          notification_url: `${process.env.NEXTAUTH_URL}/api/mercado-pago/webhook`,
          back_urls: {
            success: `${process.env.NEXTAUTH_URL}/order/${order._id}?status=approved`,
            pending: `${process.env.NEXTAUTH_URL}/order/${order._id}?status=pending`,
            failure: `${process.env.NEXTAUTH_URL}/order/${order._id}?status=rejected`,
          },
          auto_return: 'approved',
          payment_methods: {
            excluded_payment_types: [{ id: 'atm' }],
            installments: 12 // Máximo de cuotas
          },
          payer: {
            name: order.customer.name,
            email: order.customer.email,
            phone: {
              area_code: '',
              number: order.customer.phone || ''
            },
            address: {
              street_name: order.customer.address || '',
              zip_code: ''
            }
          },
          metadata: {
            order_id: order._id.toString(),
            customer_email: order.customer.email
          }
        }
      });

      return {
        id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point
      };
    } catch (error: any) {
      console.error('MercadoPago Error:', error);
      throw new Error(`Error al crear preferencia: ${error.message}`);
    }
  }
}