import Order, { IOrder, IOrderItem } from '../models/Order';

export class OrderService {
  // Crear una nueva orden
  static async createOrder(orderData: Omit<IOrder, 'createdAt' | 'status'>): Promise<IOrder> {
    return await Order.create({
      ...orderData,
      status: 'pending' // Estado por defecto
    });
  }

  // Obtener todas las órdenes
  static async getAllOrders(): Promise<IOrder[]> {
    return await Order.find().sort({ createdAt: -1 }).exec();
  }

  // Obtener orden por ID
  static async getOrderById(id: string): Promise<IOrder | null> {
    return await Order.findById(id).exec();
  }

  // Actualizar estado de la orden
  static async updateOrderStatus(id: string, status: IOrder['status']): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).exec();
  }

  // Obtener órdenes por cliente (email)
  static async getOrdersByCustomer(email: string): Promise<IOrder[]> {
    return await Order.find({ 'customer.email': email })
      .sort({ createdAt: -1 })
      .exec();
  }

  // Método para procesar webhook de Mercado Pago
  static async processPaymentWebhook(paymentId: string): Promise<IOrder | null> {
    // Aquí iría la lógica para verificar el pago con Mercado Pago
    // y actualizar la orden correspondiente
    
    // Ejemplo:
    const order = await Order.findOneAndUpdate(
      { 'paymentData.id': paymentId },
      { status: 'paid' },
      { new: true }
    ).exec();

    return order;
  }
}