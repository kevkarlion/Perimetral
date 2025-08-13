// app/api/stock/variants/[id]/route.ts
import { NextResponse } from 'next/server'
import Product from '@/backend/lib/models/Product'
import { dbConnect } from '@/backend/lib/dbConnect/dbConnect'
import { any } from 'zod';

export async function GET(req: Request, context: any) {
  try {
    await dbConnect()

    // ⚠️ Next.js 15: params dinámicos deben ser awaited
    const { id } = await context.params;

    // 1. Buscar el producto que contiene esta variante
    const product = await Product.findOne({
      'variaciones._id': id
    }).select('variaciones.$ nombre codigoPrincipal') // Solo traer los campos necesarios

    if (!product) {
      return NextResponse.json(
        { error: "Variante no encontrada" },
        { status: 404 }
      )
    }

    // 2. Extraer la variante específica
    const variant = product.variaciones.find(v => v._id.toString() === id)
    
    if (!variant) {
      return NextResponse.json(
        { error: "Variante no encontrada" },
        { status: 404 }
      )
    }

    // 3. Preparar respuesta
    const responseData = {
      _id: variant._id,
      productId: product._id,
      productName: product.nombre,
      productCode: product.codigoPrincipal,
      medida: variant.medida,
      precio: variant.precio,
      stock: variant.stock,
      codigo: variant.codigo,
      atributos: variant.atributos
    }

    return NextResponse.json({ 
      success: true,
      data: responseData 
    })

  } catch (error) {
    console.error('Error en API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: "Error interno del servidor" 
      },
      { status: 500 }
    )
  }
}