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
    const orderData = await req.json();

    // console.log('📦 Datos recibidos del carrito:', {
    //   itemsCount: orderData.items.length,
    //   subtotal: orderData.subtotal,
    //   iva: orderData.iva,
    //   total: orderData.total
    // });

    // Validar el carrito (ahora preservará el total con IVA)
    const validatedCart = await validateCart({
      items: orderData.items,
      total: orderData.total, // Este incluye IVA
      subtotal: orderData.subtotal, // Pasar subtotal si está disponible
      iva: orderData.iva // Pasar IVA si está disponible
    });

    // console.log('✅ Carrito validado:', {
    //   subtotalValidado: validatedCart.subtotal,
    //   ivaValidado: validatedCart.vat,
    //   totalValidado: validatedCart.total 
    // });

    // Crear la orden con el total correcto (que incluye IVA)
    const newOrder = await createOrder({
      ...orderData,
      items: validatedCart.items,
      subtotal: validatedCart.subtotal,
      iva: validatedCart.vat,
      total: validatedCart.total, // ← Este ya incluye IVA y se usará para Mercado Pago
      status: 'pending'
    });

    return NextResponse.json(newOrder, { status: 201 });
    
  } catch (error: any) {
    console.error('❌ Error creating order:', error);
    const status = error.message.includes('no coincide') ? 400 : 500;
    
    return NextResponse.json(
      { error: error.message },
      { status }
    );
  }
}
// Configuración de Next.js para métodos HTTP
export const dynamic = 'force-dynamic'; // Opcional: para evitar caching