// app/api/stock/[id]/route.ts
import { NextResponse } from 'next/server'
import { getProductById } from '@/backend/lib/controllers/productControllers'
import { Types } from "mongoose"



//context contiene información sobre la request que Next.js te pasa automáticamente.
// {
//   params: { id: string },   
//   request: Request,        
 
// }




export async function GET(request: Request, context: any) {
  try {
    // ⚠️ En Next.js 15, params dinámicos deben ser await
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "No se recibió ID" },
        { status: 400 }
      )
    }

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "ID inválido" },
        { status: 400 }
      )
    }

    // Obtener el producto usando tu controlador
    const response = await getProductById(id)

    // Retornar la respuesta directamente
    return response

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener producto',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
