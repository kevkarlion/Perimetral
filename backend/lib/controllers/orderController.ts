import { OrderService } from '@/backend/lib/services/order.services';
import Order from '@/backend/lib/models/Order';

export async function getOrders() {
  return await Order.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
}

export async function createOrder(orderData: {
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
  console.log('orderController loaded', JSON.stringify(orderData, null, 2));

  return await OrderService.createValidatedOrder(orderData);
}