// app/api/movement-stock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { StockController } from '@/backend/lib/controllers/stockController';

// GET - Obtener movimientos de stock
export async function GET(req: NextRequest) {

  
  try {
    // Extraer los parámetros de la URL
    const { searchParams } = new URL(req.url);
    const filter = {
      productId: searchParams.get('productId') || undefined,
      variationId: searchParams.get('variationId') || undefined,
      type: searchParams.get('type') || undefined,
      productName: searchParams.get('productName') || undefined,
      categoryName: searchParams.get('categoryName') || undefined,
      variationName: searchParams.get('variationName') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
      startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined,
      endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined,
    };

    // ✅ PASA AMBOS ARGUMENTOS: filter Y req
    const response = await StockController.getMovements(filter, req);
    return response;
    
  } catch (error: any) {
    console.error('Error en route handler:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo movimiento de stock
export async function POST(req: NextRequest) {
  try {
    const response = await StockController.createMovement(req);
    return response;
  } catch (error: any) {
    console.error('Error en route handler POST:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}