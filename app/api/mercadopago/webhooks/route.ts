import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';

import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import { dbConnect } from '@/lib/dbConnect/dbConnect';

type WebhookBody = {
  action: string;
  data: { id: string };
};

const token = process.env.MP_ACCESS_TOKEN;
console.log('🔑 Token de acceso de MercadoPago:', token ? 'Cargado' : 'No cargado');
if (!token) throw new Error('⚠️ Falta MP_ACCESS_TOKEN en las variables de entorno');

const client = new MercadoPagoConfig({ accessToken: token });

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body: WebhookBody = await request.json();
    const paymentId = body.data.id;

    console.log('📩 Notificación recibida:', body);
    console.log('🔍 ID del pago:', paymentId);

    const isSandbox = request.headers.get('x-mercadopago-test');
    console.log('🌍 Webhook desde:', isSandbox ? 'SANDBOX' : 'PRODUCCIÓN');

    // Validar tipo de acción
    const allowedActions = ['payment.created', 'payment.updated'];
    if (!allowedActions.includes(body.action)) {
      return NextResponse.json(
        { received: true, message: 'Notificación no relevante' },
        { status: 200 }
      );
    }

    // Consultar el pago en MercadoPago
    const paymentClient = new Payment(client);
    const payment = await paymentClient.get({ id: paymentId });

    if (!payment || !payment.status) {
      throw new Error('❌ No se pudo obtener el estado del pago');
    }

    console.log('💳 Estado del pago:', payment.status);
    console.log('📦 Referencia externa (order ID):', payment.external_reference);

    if (payment.external_reference) {
      const order = await Order.findById(payment.external_reference);

      if (!order) {
        throw new Error(`❌ Orden no encontrada: ${payment.external_reference}`);
      }

      // Evitar doble procesamiento
      if (['completed', 'cancelled'].includes(order.status)) {
        console.log('⚠️ Orden ya procesada, ignorando...');
        return NextResponse.json({ received: true });
      }

      // Determinar nuevo estado de la orden
      let newStatus = 'pending';
      if (payment.status === 'approved') newStatus = 'completed';
      if (payment.status === 'rejected') newStatus = 'cancelled';

      await Order.updateOne(
        { _id: order._id },
        {
          status: newStatus,
          paymentId: payment.id,
          paymentDetails: payment,
          updatedAt: new Date()
        }
      );

      // Actualizar stock si el pago fue aprobado
      if (payment.status === 'approved') {
        const bulkOps = order.items.map((item: any) => ({
          updateOne: {
            filter: { _id: item.productId },
            update: {
              $inc: {
                stock: -item.quantity,
                salesCount: item.quantity
              }
            }
          }
        }));

        await Product.bulkWrite(bulkOps);
        console.log('✅ Stock actualizado correctamente.');
      }

      console.log(`✅ Orden ${order._id} actualizada a estado: ${newStatus}`);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('❌ Error en webhook:', error.message || error);
    // Siempre devolver 200 para evitar reintentos automáticos de MercadoPago
    return NextResponse.json(
      { received: true, error: 'Error procesando notificación' },
      { status: 200 }
    );
  }
}
