// app/api/movement-stock/route.ts
import { NextRequest } from 'next/server';
import { StockController } from '@/backend/lib/controllers/stockController';

// GET - Obtener movimientos de stock
export async function GET(req: NextRequest) {
  return StockController.getMovements(req);
}

// POST - Crear nuevo movimiento de stock
export async function POST(req: NextRequest) {
  return StockController.createMovement(req);
}