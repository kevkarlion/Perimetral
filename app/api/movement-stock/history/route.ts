// app/api/stock/history/route.ts
import { NextRequest } from 'next/server';
import { StockController } from '@/backend/lib/controllers/stockController';

// GET - Obtener historial de stock
export async function GET(req: NextRequest) {
  return StockController.getStockHistory(req);
}