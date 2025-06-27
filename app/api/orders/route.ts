// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import Order from '@/lib/models/Order';
import { dbConnect } from '@/lib/dbConnect/dbConnect';
import { logError } from '@/lib/utils/ErrorHandler';

export async function POST(request: Request) {
  try {
    // 1. Conectar a la base de datos
    await dbConnect();
    
    // 2. Parsear y validar los datos de entrada
    const { items, total, customerInfo } = await request.json();
    
    console.log('Datos recibidos:', { 
      itemsCount: items?.length, 
      total,
      customerEmail: customerInfo?.email 
    });

    // Validación exhaustiva
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      );
    }

    if (typeof total !== 'number' || total <= 0) {
      return NextResponse.json(
        { error: 'Total inválido' },
        { status: 400 }
      );
    }

    if (!customerInfo?.email || !customerInfo?.name) {
      return NextResponse.json(
        { error: 'Información del cliente incompleta' },
        { status: 400 }
      );
    }

    // 3. Preparar items para la orden
    const orderItems = items.map(item => {
      // Validación de cada item
      if (!item.productId || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        throw new Error(`Item inválido: ${JSON.stringify(item)}`);
      }

      return {
        productId: item.productId,
        name: item.name.substring(0, 100), // Limitar longitud
        price: Number(item.price.toFixed(2)), // Asegurar 2 decimales
        quantity: Math.max(1, Math.floor(item.quantity)), // Cantidad mínima 1
        image: item.image?.substring(0, 500), // Limitar URL de imagen
        ...(item.variationId && { 
          variationId: item.variationId,
          medida: item.medida?.substring(0, 50) 
        })
      };
    });

    // 4. Crear la orden en la base de datos
    const newOrder = await Order.create({
      customer: {
        name: customerInfo.name.substring(0, 100),
        email: customerInfo.email.substring(0, 100),
        address: customerInfo.address?.substring(0, 200),
        phone: customerInfo.phone?.substring(0, 20)
      },
      items: orderItems,
      total: Number(total.toFixed(2)),
      status: 'pending',
      paymentMethod: 'mercadoPago',
      paymentDetails: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`Orden creada: ${newOrder._id}`);

    // 5. Crear preferencia de pago en MercadoPago
    const mpResponse = await fetch(`http://localhost:3000/api/mercadopago`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_INTERNAL_SECRET}` // Seguridad adicional
      },
      body: JSON.stringify({
        items: orderItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          ...(item.variationId && { variationId: item.variationId })
        })),
        metadata: {
          orderId: newOrder.id, // Usar el campo id en lugar de _id
          customerEmail: customerInfo.email,
          customerName: customerInfo.name,
          total: newOrder.total
        }
      }),
      signal: AbortSignal.timeout(10000) // Timeout de 10 segundos
    });

    // 6. Manejar respuesta de MercadoPago
    if (!mpResponse.ok) {
      const errorData = await mpResponse.json().catch(() => ({}));
      logError('MercadoPago Error', {
        status: mpResponse.status,
        errorData,
        orderId: newOrder.id
      });

      // Revertir la creación de la orden si falla MP
      await Order.deleteOne({ _id: newOrder._id });
      
      throw new Error(
        errorData.error?.message || 
        `Error en MercadoPago: ${mpResponse.statusText}` ||
        'Error al crear el pago'
      );
    }

    const { checkoutUrl, preferenceId } = await mpResponse.json();

    // 7. Actualizar la orden con el ID de preferencia
    await Order.updateOne(
      { _id: newOrder._id },
      { 
        paymentDetails: { preferenceId },
        updatedAt: new Date() 
      }
    );

    // 8. Retornar respuesta exitosa
    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      checkoutUrl,
      items: orderItems,
      total: newOrder.total
    }, { status: 201 });

  } catch (error) {
    // Manejo detallado de errores
    logError('POST /api/orders', error);

    return NextResponse.json(
      { 
        error: 'Error al procesar la orden',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Error desconocido',
          stack: error instanceof Error ? error.stack : undefined
        })
      },
      { status: 500 }
    );
  }
}