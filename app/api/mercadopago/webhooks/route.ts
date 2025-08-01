// src/app/api/webhooks/mercadopago/route.ts
import { NextResponse } from 'next/server';
import { Payment } from 'mercadopago';
import { client } from '@/backend/lib/services/mercadoPagoPayment';
import { OrderService } from '@/backend/lib/services/order.services';

export async function POST(request: Request) {
  try {
    // Verificar la firma del webhook (opcional pero recomendado para producción)
    const signature = request.headers.get('x-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Firma no proporcionada' }, { status: 401 });
    }

    // Leer el cuerpo de la solicitud
    const body = await request.json();
    
    // Validar datos básicos
    if (!body.data || !body.data.id) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }

    const paymentId = body.data.id;

    // Obtener los detalles del pago desde Mercado Pago
    const payment = new Payment(client);
    const paymentDetails = await payment.get({ id: paymentId });

    // Procesar el pago y actualizar tu base de datos
    await processPayment(paymentDetails);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error en webhook:', error);
    return NextResponse.json(
      { error: 'Error procesando el webhook', details: error.message },
      { status: 500 }
    );
  }
}

async function processPayment(paymentDetails: any) {
  const { id, status, external_reference, transaction_amount } = paymentDetails;
  
  // Actualiza la orden usando tu servicio existente
  await OrderService.updateOrderStatus(
    external_reference,
    status === 'approved' ? 'processing' : 'pending_payment', // Ejemplo básico
    {
      paymentStatus: status,
      paymentId: id,
      paidAmount: transaction_amount
    }
  );
}