// src/app/api/webhooks/mercadopago/route.ts
import { NextResponse } from 'next/server';
import { Payment } from 'mercadopago';
import { client } from '@/backend/lib/services/mercadoPagoPayment';
import { OrderService } from '@/backend/lib/services/order.services';
import {
  MercadoPagoPayment,
  MercadoPagoAdditionalInfo,
  MercadoPagoItem,
  WebhookResponse
} from '@/types/mercadopagoTypes';

export async function POST(request: Request): Promise<NextResponse<WebhookResponse>> {
  try {
    const body = await request.json();
    
    if (!body.data || !body.data.id) {
      console.error('Invalid webhook data:', body);
      return NextResponse.json(
        { success: false, error: 'Invalid data' }, 
        { status: 400 }
      );
    }

    const paymentId = body.data.id;
    const payment = new Payment(client);
    const paymentDetails = await payment.get({ id: paymentId }) as MercadoPagoPayment;

    if (paymentDetails.status !== 'approved') {
      console.log(`Payment ${paymentId} not approved, status: ${paymentDetails.status}`);
      return NextResponse.json({ success: true });
    }

    const orderId = paymentDetails.additional_info?.reference;
    const items = paymentDetails.additional_info?.items || [];

    if (!orderId) {
      console.error('OrderId not found in additional_info.reference');
      return NextResponse.json(
        { success: false, error: 'OrderId not provided' },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      console.error('No items in payment:', paymentDetails);
      return NextResponse.json(
        { success: false, error: 'No products in payment' },
        { status: 400 }
      );
    }

    await OrderService.updateOrderStatus(
      orderId,
      'completed',
      {
        paymentStatus: 'approved',
        paymentId,
        paidAmount: paymentDetails.transaction_amount
      }
    );

    const stockUpdates = await updateStockForItems(items);

    return NextResponse.json({ 
      success: true,
      orderId,
      stockUpdates
    });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error processing webhook',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

async function updateStockForItems(items: MercadoPagoItem[]) {
  const updateResults: WebhookResponse['stockUpdates'] = [];
  
  for (const item of items) {
    try {
      if (!item.id || !item.quantity) {
        throw new Error(`Invalid item: ${JSON.stringify(item)}`);
      }

      const payload = {
        productId: item.id,
        stock: -Math.abs(item.quantity),
        action: 'increment' as const,
        ...(item.variation_id && { variationId: item.variation_id })
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      updateResults.push({
        productId: item.id,
        success: response.ok,
        data: await response.json(),
        ...(!response.ok && { error: response.statusText })
      });
      
    } catch (error) {
      updateResults.push({
        productId: item.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return updateResults;
}