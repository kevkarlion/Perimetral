import { NextResponse } from 'next/server'
import { getProductById } from '@/backend/lib/controllers/productControllers'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const response = await getProductById(params.id)
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