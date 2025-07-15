// services/order.services.ts
import Order from '@/lib/models/Order';
import { validateCart } from '@/backend/services/validate.cart.services';
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
    // 1. Validar el carrito
    const validated = await validateCart({
      items: orderData.items,
      total: orderData.total
    });

    // 2. Crear la orden en DB
    const order = new Order({
      customer: orderData.customer,
      items: orderData.items,
      total: validated.total,
      status: 'pending',
      paymentMethod: orderData.paymentMethod,
      paymentDetails: {}
    });

    await order.save();

    // 3. Si el método es MercadoPago, crear preferencia
    if (orderData.paymentMethod === 'mercadopago') {
      try {
        const preference = await MercadoPagoService.createPreference(order);
        return {
          ...order.toObject(),
          paymentUrl: preference.init_point || preference.sandbox_init_point
        };
      } catch (error) {
        // Si falla la creación de la preferencia, actualiza el estado de la orden
        order.status = 'failed';
        order.paymentDetails.error = error.message;
        await order.save();
        throw error;
      }
    }

    return order;
  }
}