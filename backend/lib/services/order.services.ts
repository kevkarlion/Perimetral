// services/order.services.ts
import Order from '@/backend/lib/models/Order';
import { validateCart } from '@/backend/lib/services/validate.cart.services';
import { MercadoPagoService } from './mercadoPago.services';

export class OrderService {
  static async createValidatedOrder(orderData: {
    items: Array<{
      productId: string;
      variationId?: string;
      name: string;
      price: number;
      quantity: number;
      image?: string;
      medida?: string;
    }>;
    total: number;
    customer: {
      name: string;
      email: string;
      address?: string;
      phone?: string;
    };
    paymentMethod: string;
  }) {
    try {
      // 1. Validar el carrito
      const validated = await validateCart({
        items: orderData.items,
        total: orderData.total
      });

      // 2. Crear la orden en DB con estado inicial
      const order = new Order({
        customer: orderData.customer,
        items: validated.items,
        total: validated.total,
        status: 'pending',
        paymentMethod: orderData.paymentMethod,
        paymentDetails: {
          status: 'pending'
        }
      });

      await order.save();

      // 3. Si el método es MercadoPago, crear preferencia
      if (orderData.paymentMethod === 'mercadopago') {
        try {
          const preference = await MercadoPagoService.createPreference(order);
          
          // Manejo seguro de sandbox/producción
          const paymentUrl = (preference as any).sandbox_init_point || preference.init_point;
          
          if (!paymentUrl) {
            throw new Error('No se pudo generar URL de pago de MercadoPago');
          }

          // Actualizar la orden con los detalles de pago
          order.paymentDetails = {
            ...order.paymentDetails,
            paymentUrl,
            merchantOrderId: preference.id,
            paymentStatus: 'pending'
          };

          await order.save();

          return {
            ...order.toObject(),
            paymentUrl
          };
        } catch (mpError: any) {
          // Manejo específico de errores de MercadoPago
          console.error('Error en MercadoPago:', mpError);
          order.status = 'payment_failed';
          order.paymentDetails = {
            ...order.paymentDetails,
            error: mpError.message,
            paymentStatus: 'failed'
          };
          await order.save();
          
          throw new Error(`Error al procesar pago: ${mpError.message}`);
        }
      }

      // Para otros métodos de pago
      return order;
    } catch (error: any) {
      console.error('Error general al crear orden:', error);
      throw new Error(`Error al crear la orden: ${error.message}`);
    }
  }

  static async updateOrderStatus(orderId: string, status: string, paymentDetails: any = {}) {
    try {
      const validStatuses = ['pending', 'processing', 'completed', 'payment_failed', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        throw new Error(`Estado '${status}' no válido`);
      }

      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          status,
          'paymentDetails.status': paymentDetails.status || status,
          'paymentDetails.updated': new Date(),
          ...paymentDetails,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!order) {
        throw new Error('Orden no encontrada');
      }

      return order;
    } catch (error: any) {
      console.error('Error al actualizar orden:', error);
      throw new Error(`Error al actualizar estado de la orden: ${error.message}`);
    }
  }

  static async getOrderById(orderId: string) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Orden no encontrada');
      }
      return order;
    } catch (error: any) {
      console.error('Error al obtener orden:', error);
      throw new Error(`Error al obtener la orden: ${error.message}`);
    }
  }
}