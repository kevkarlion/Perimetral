// app/api/stock/low-stock/route.ts
import { NextRequest } from 'next/server';
import { StockController } from '@/backend/lib/controllers/stockController';

// GET - Obtener productos con stock bajo
export async function GET(req: NextRequest) {
  return StockController.getLowStockItems(req);
}