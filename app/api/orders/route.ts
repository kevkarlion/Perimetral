import { NextResponse } from 'next/server.js';
import Order from '@/lib/models/Order.js';
import Product, { IProduct } from '@/lib/models/Product.js'; // Asegúrate de importar IProduct

export async function POST(request: Request) {
  try {
    const { items, ...orderData } = await request.json();

    // 1. Verificar productos
    const products = await Product.find({ 
      _id: { $in: items.map((i: any) => i.productId) }
    }).exec() as IProduct[]; // 👈 Cast a IProduct[]

    if (products.length !== items.length) {
      return NextResponse.json(
        { error: 'Uno o más productos no existen' },
        { status: 400 }
      );
    }

    // 2. Crear orden
    const newOrder = await Order.create({
      ...orderData,
      items,
      status: 'pending'
    });

    // 3. Actualizar stock
    const bulkOps = items.map((item: any) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: {
          $inc: { stock: -item.quantity },
          $push: {
            historialStock: {
              cantidad: -item.quantity,
              motivo: 'venta',
              ordenId: newOrder._id,
              fecha: new Date()
            }
          }
        }
      }
    }));

    await Product.bulkWrite(bulkOps);

    // 4. Obtener productos actualizados con virtuals
    const updatedProducts = await Product.find({ 
      _id: { $in: items.map((i: any) => i.productId) }
    }).lean().exec() as IProduct[]; // 👈 Usar lean() para objetos simples

    // 5. Preparar respuesta
    const stockStatus = updatedProducts.map(p => ({
      productId: p._id,
      nombre: p.nombre,
      stockActual: p.stock,
      estadoStock: p.estadoStock // 👈 Ahora funciona
    }));

    return NextResponse.json({
      order: newOrder,
      stockStatus
    }, { status: 201 });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Error al procesar la orden' },
      { status: 500 }
    );
  }
}