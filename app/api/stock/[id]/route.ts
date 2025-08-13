// app/api/stock/[id]/route.ts
import { NextResponse } from 'next/server'
import { getProductById } from '@/backend/lib/controllers/productControllers'
import { Types } from "mongoose";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
    return NextResponse.json({ success: false, error: "No se recibió ID" }, { status: 400 });
  }
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: "ID inválido" }, { status: 400 });
  }
    const response = await getProductById(id)
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