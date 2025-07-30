import { Preference } from 'mercadopago';
import { client } from '@/lib/mercadopago';




export class MercadoPagoService {
  static async createPreference(order: any) {
    try {
      const preference = new Preference(client);
      
      // 1. MAPEO DE ITEMS - Mejoras de robustez
      const items = order.items.map((item: any) => ({
        title: item.name.substring(0, 256), // MercadoPago limita a 256 caracteres
        unit_price: Number(parseFloat(item.price).toFixed(2)), // Aseguramos 2 decimales
        quantity: Number(item.quantity),
        currency_id: 'ARS',
        // Campos adicionales recomendados:
        id: item.productId, // Identificador único de tu producto
        description: item.medida || undefined, // Opcional pero útil
        picture_url: item.image || undefined // URL de imagen del producto
      }));

      // 2. CONFIGURACIÓN COMPLETA DE PREFERENCIA
      const response = await preference.create({
        body: {
          items: items,
          payer: {
            email: order.customer.email,
            name: order.customer.name, // Recomendado para mejor UX
            phone: order.customer.phone ? { number: order.customer.phone } : undefined,
            address: order.customer.address ? { 
              street_name: order.customer.address 
            } : undefined
          },
          // IDENTIFICADOR CLAVE - Vincula MP con tu orden
          external_reference: order._id.toString(), 
          
          // URL DE NOTIFICACIÓN - Para recibir actualizaciones de estado
          notification_url: `${process.env.BASE_URL}/api/webhooks/mercadopago`,
          
          // CONFIGURACIÓN DE REDIRECCIÓN
          auto_return: 'approved', // Redirige automáticamente al éxito
          back_urls: {
            success: `${process.env.FRONTEND_URL}/pago-exitoso/success`,
            failure: `${process.env.FRONTEND_URL}/pago-fallido/failure`, 
            pending: `${process.env.FRONTEND_URL}/pago-pendiente/pending`
          },
          
          // CONFIGURACIONES ADICIONALES RECOMENDADAS:
          payment_methods: {
            excluded_payment_types: [{ id: 'atm' }], // Ej: excluir pagos en efectivo
            installments: 12 // Máximo de cuotas permitidas
          },
          expires: false, // Para que no expire la preferencia
          date_of_expiration: new Date(Date.now() + 3600 * 1000 * 24).toISOString(), // Opcional: expira en 24hs
          metadata: { // Datos adicionales para tu referencia
            store: 'tu-tienda',
            internal_order_id: order._id.toString()
          }
        }
      });

      // 3. MANEJO DE RESPUESTA - Compatibilidad sandbox/producción
      return {
        id: response.id,
        init_point: response.init_point || (response as any).sandbox_init_point,
        // Datos adicionales útiles:
        sandbox: !!response.sandbox_init_point, // Indica si es modo prueba
        created_date: response.date_created,
        // Para debugging:
        full_response: process.env.NODE_ENV === 'development' ? response : undefined
      };

    } catch (error: any) {
      console.error('Error al crear preferencia en MercadoPago:', {
        status: error.status,
        code: error.code,
        message: error.message,
        order_id: order?._id,
        items_count: order?.items?.length
      });
      
      // Mejor manejo de errores específicos
      let customError = new Error('Error al procesar el pago');
      customError.name = 'MercadoPagoError';
      
      // Puedes agregar lógica específica para ciertos errores
      if (error.status === 401) {
        customError.message = 'Error de autenticación con MercadoPago';
      } else if (error.status === 400) {
        customError.message = 'Datos inválidos para el pago';
      }
      
      throw customError;
    }
  }
}