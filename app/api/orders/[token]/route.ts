// app/api/orders/[token]/route.ts
import { NextResponse } from 'next/server';
import Order, { IOrder } from '@/backend/lib/models/Order'; // Importa también la interfaz

interface OrderResponse {
  orderNumber: string;
  status: string;
  createdAt: Date;
  customer: {
    name: string;
    email: string;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image?: string;
    medida?: string;
  }>;
  total: number;
  paymentMethod: string;
  paymentStatus?: string;
}

export async function GET(
  request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    // Buscar la orden por token con tipado explícito
    const order = await Order.findOne({ accessToken: token })
      .select('-paymentDetails.mercadoPagoResponse')
      .lean()
      .exec() as unknown as IOrder; // Conversión de tipo explícita

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada o token inválido' },
        { status: 404 }
      );
    }

    // Formatear respuesta con tipado seguro
    const response: OrderResponse = {
      orderNumber: order.orderNumber, // Ahora debería reconocer la propiedad
      status: order.status,
      createdAt: order.createdAt,
      customer: {
        name: order.customer.name,
        email: order.customer.email
      },
      items: order.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || undefined,
        medida: item.medida || undefined
      })),
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentDetails?.status
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener la orden' },
      { status: 500 }
    );
  }
}