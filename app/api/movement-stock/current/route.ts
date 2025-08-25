// app/api/stock/current/route.ts
import { NextRequest } from 'next/server';
import { StockController } from '@/backend/lib/controllers/stockController';

// GET - Obtener stock actual de un producto/variación
export async function GET(req: NextRequest) {
  return StockController.getCurrentStock(req);
}