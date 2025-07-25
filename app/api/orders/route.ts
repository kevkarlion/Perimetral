// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { getOrders, createOrder } from '@/backend/lib/controllers/orderController';
import { validateCart } from '@/backend/lib/services/validate.cart.services';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener las órdenes' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // 1. Parsear los datos del request
    const orderData = await req.json();

    // 2. Validar el carrito antes de procesar
    const validatedCart = await validateCart({
      items: orderData.items,
      total: orderData.total
    });

    console.log('[POST /orders] Datos del carrito validados:', JSON.stringify(validatedCart, null, 2));
    // 3. Crear la orden con datos validados
    const newOrder = await createOrder({
      ...orderData,
      items: validatedCart.items, // Usar los items validados
      total: validatedCart.total,  // Usar el total validado
      status: 'pending'
    });

    // 4. Retornar respuesta exitosa
    console.log('new order', newOrder);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    // Manejo de errores específicos
    const status = error.message.includes('validación') ? 400 : 500;
    
    return NextResponse.json(
      { 
        error: error.message,
        errorType: error.errorType || 'ORDER_ERROR'
      },
      { status }
    );
  }
}

// Configuración de Next.js para métodos HTTP
export const dynamic = 'force-dynamic'; // Opcional: para evitar caching