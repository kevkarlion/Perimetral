import Order from '@/lib/models/Order';
import { validateCart } from '@/backend/services/validate.cart.services';

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
      items: orderData.items.map(item => ({
        productId: item.productId,
        variationId: item.variationId,
        quantity: item.quantity,
        price: item.price
      })),
      total: orderData.total
    });

    // 2. Crear la orden en DB
    const order = new Order({
      customer: orderData.customer,
      items: orderData.items.map(item => ({
        productId: item.productId,
        variationId: item.variationId || undefined,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || undefined,
        medida: item.medida || undefined
      })),
      total: validated.total,
      status: 'pending',
      paymentMethod: orderData.paymentMethod,
      paymentDetails: {}
    });

    await order.save();
    return order;
  }
}