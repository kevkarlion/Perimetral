// app/api/stock/[id]/route.ts
import { NextRequest } from 'next/server';
import { StockController } from '@/backend/lib/controllers/stockController';

interface Context {
  params: { id: string };
}

// GET - Obtener movimiento específico por ID
export async function GET(req: NextRequest, context: Context) {
  const { id } = context.params;
  return StockController.getMovementById(req, id);
}