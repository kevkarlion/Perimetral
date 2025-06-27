// app/api/webhooks/mercadopago/route.ts
import { NextResponse } from 'next/server';
import MercadoPago from 'mercadopago';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';
import { dbConnect } from '@/lib/dbConnect/dbConnect';

// Configurar cliente de MercadoPago
const client = new MercadoPago({
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: { timeout: 10000 }
});

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    console.log('Notificación recibida:', body);

    // Validar que sea una notificación de pago
    if (body.action !== 'payment.updated') {
      return NextResponse.json(
        { received: true, message: 'Notificación no relevante' },
        { status: 200 }
      );
    }

    const paymentId = body.data.id;
    
    // 1. Verificar el pago con la API de MercadoPago
    const payment = await MercadoPago.payment.findById(paymentId, { access_token: process.env.MP_ACCESS_TOKEN! });
    console.log('Estado del pago:', payment.status);

    // 2. Actualizar la orden correspondiente
    if (payment.external_reference) {
      const order = await Order.findById(payment.external_reference);
      
      if (!order) {
        throw new Error(`Orden no encontrada: ${payment.external_reference}`);
      }

      // Actualizar estado de la orden
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

      // 3. Actualizar stock solo si el pago fue aprobado
      if (payment.status === 'approved') {
        const bulkOps = order.items.map(item => ({
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
      }

      console.log(`Orden ${order._id} actualizada a estado: ${newStatus}`);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error en webhook:', error);
    // IMPORTANTE: Siempre devolver 200 a MercadoPago para que no reintente
    return NextResponse.json(
      { received: true, error: 'Error procesando notificación' },
      { status: 200 }
    );
  }
}