// app/api/mercadopago/route.ts1
//Crea la preferencia de pago con Mercado Pago


import { NextResponse } from 'next/server';
import MercadoPago, { Preference } from 'mercadopago';

const client = new MercadoPago({ 
  accessToken: process.env.MP_ACCESS_TOKEN!,
  options: { timeout: 10000 }
});

export async function POST(request: Request) {
  try {
    const { items, metadata } = await request.json();
    console.log('Datos recibidos para crear preferencia:', { items, metadata });

    // Validación básica
    if (!items?.length) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      );
    }

    // Verificar que la URL base esté configurada
    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      throw new Error('NEXT_PUBLIC_SITE_URL no está configurado');
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const notificationUrl = `http://localhost:3000/api/mercadopago/webhooks`;

    // Crear preferencia
    const preference = new Preference(client);
    const response = await preference.create({
      body: {
        items: items.map(item => ({
          title: item.name?.substring(0, 50) || 'Producto',
          unit_price: Number(item.price),
          quantity: Number(item.quantity),
          currency_id: 'ARS',
          ...(item.image && { picture_url: item.image })
        })),
          // back_urls: {
          //   success: "http://localhost:3000/pago-exitoso", // URL para pagos exitosos
          //   failure: "http://localhost:3000/pago-fallido", // URL para pagos fallidos
          //   pending: "http://localhost:3000/pago-pendiente", // URL para pagos pendientes
          // },
        // auto_return: 'approved',
        notification_url: notificationUrl,
        external_reference: metadata?.orderId,
        binary_mode: true
      }
    });

    console.log('Preferencia creada:', response);
    return NextResponse.json({
      success: true,
      checkoutUrl: response.init_point
    });

  } catch (error: any) {
    console.error('Error en Mercado Pago:', {
      message: error.message,
      ...(error.response?.data && { apiError: error.response.data })
    });

    return NextResponse.json(
      { 
        error: 'Error al crear el pago',
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          ...(error.config && { config: error.config })
        } : undefined
      },
      { status: 500 }
    );
  }
}