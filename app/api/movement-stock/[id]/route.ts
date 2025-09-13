// app/api/stock/[id]/route.ts
import { NextRequest } from 'next/server';
import { StockController } from '@/backend/lib/controllers/stockController';

interface Context {
  params: { id: string };
}

// GET - Obtener movimiento específico por ID
// GET - Obtener todos los movimientos de una variación
export async function GET(req: NextRequest, context: Context) {
  console.log("context params, desde id", context.params);
  const { id } = context.params; // ojo: el nombre del parámetro en la ruta debe coincidir
  return StockController.getMovementsByVariationId(req, id);
}
