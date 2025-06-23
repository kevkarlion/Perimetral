import { NextResponse } from 'next/server';
import { PaymentService } from '@/lib/services/paymentServices';

export async function POST(request: Request) {
  try {
    const orderData = await request.json();
    const preference = await PaymentService.createMercadoPagoPreference(orderData);
    return NextResponse.json(preference);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al generar el pago' },
      { status: 500 }
    );
  }
}