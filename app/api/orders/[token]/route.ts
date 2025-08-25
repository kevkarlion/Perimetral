//api/orders/[token]
import { NextResponse } from 'next/server';
import Order, { IOrder } from '@/backend/lib/models/Order';
import { updateOrderByTokenController } from '@/backend/lib/controllers/orderController';


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
  context: { params: Promise<{ token: string }> } // 👈 ahora es Promise
) {
  try {
    const { token } = await context.params; // 👈 await acá

    const order = await Order.findOne({ accessToken: token })
      .select('-paymentDetails.mercadoPagoResponse')
      .lean()
      .exec() as unknown as IOrder;

    if (!order) {
      return NextResponse.json(
        { error: 'Orden no encontrada o token inválido' },
        { status: 404 }
      );
    }

    const response: OrderResponse = {
      orderNumber: order.orderNumber,
      status: order.status,
      createdAt: order.createdAt,
      customer: {
        name: order.customer.name,
        email: order.customer.email,
      },
      items: order.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || undefined,
        medida: item.medida || undefined,
      })),
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentDetails?.status,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener la orden' },
      { status: 500 }
    );
  }
}

// PATCH: actualizar orden por token
export async function PATCH(
  request: Request,
  context: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await context.params;
    const body = await request.json();
    const { status, additionalData } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Debes enviar un estado válido." },
        { status: 400 }
      );
    }

    const updatedOrder = await updateOrderByTokenController(
      token,
      status,
      additionalData || {}
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Orden actualizada correctamente",
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Error al actualizar la orden" },
      { status: 500 }
    );
  }
}