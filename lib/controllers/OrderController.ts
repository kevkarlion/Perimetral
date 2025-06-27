import { NextResponse } from 'next/server';
import { OrderService } from '@/lib/services/OrderService';
import Order, { IOrder, IOrderItem } from '@/lib/models/Order';

export class OrderController {
  // POST /api/orders - Crear nueva orden
  static async createOrder(request: Request) {
    try {
      const orderData: Omit<IOrder, 'createdAt' | 'status'> = await request.json();
      const newOrder = await OrderService.createOrder(orderData);
      return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: 'Error al crear la orden' },
        { status: 400 }
      );
    }
  }

  // GET /api/orders - Obtener todas las órdenes
  static async getAllOrders() {
    try {
      const orders = await OrderService.getAllOrders();
      return NextResponse.json(orders);
    } catch (error) {
      return NextResponse.json(
        { error: 'Error al obtener las órdenes' },
        { status: 500 }
      );
    }
  }

  // GET /api/orders/:id - Obtener orden por ID
  static async getOrderById(request: Request, { params }: { params: { id: string } }) {
    try {
      const order = await OrderService.getOrderById(params.id);
      if (!order) {
        return NextResponse.json(
          { error: 'Orden no encontrada' },
          { status: 404 }
        );
      }
      return NextResponse.json(order);
    } catch (error) {
      return NextResponse.json(
        { error: 'Error al obtener la orden' },
        { status: 500 }
      );
    }
  }

  // PATCH /api/orders/:id/status - Actualizar estado de la orden
  static async updateOrderStatus(request: Request, { params }: { params: { id: string } }) {
    try {
      const { status } = await request.json();
      const updatedOrder = await OrderService.updateOrderStatus(params.id, status);
      
      if (!updatedOrder) {
        return NextResponse.json(
          { error: 'Orden no encontrada' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(updatedOrder);
    } catch (error) {
      return NextResponse.json(
        { error: 'Error al actualizar la orden' },
        { status: 500 }
      );
    }
  }

  // GET /api/orders/customer/:email - Obtener órdenes por cliente
  static async getOrdersByCustomer(request: Request, { params }: { params: { email: string } }) {
    try {
      const orders = await OrderService.getOrdersByCustomer(params.email);
      return NextResponse.json(orders);
    } catch (error) {
      return NextResponse.json(
        { error: 'Error al obtener las órdenes del cliente' },
        { status: 500 }
      );
    }
  }
}