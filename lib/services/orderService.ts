import Order from '@/lib/models/Order';
import { dbConnect } from '@/lib/dbConnect/dbConnect';

const orderService = {
  async getAllOrders() {
    await dbConnect();
    return Order.find().sort({ createdAt: -1 }); // órdenes recientes primero
  },

  async createOrder(orderData: any) {
    await dbConnect();
    return Order.create(orderData);
  },

  async deleteOrder(id: string) {
    await dbConnect();
    return Order.findByIdAndDelete(id);
  }
};

export default orderService;
