// backend/lib/controllers/stockMovementController.ts
import { NextResponse } from "next/server";

// Services de movimientos de stock
import { StockMovementService } from "@/backend/lib/services/StockMovement";



export class StockMovementController {
  // backend/lib/controllers/StockMovementController.ts
static async getAll(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page")) || 1;
  const limit = Number(url.searchParams.get("limit")) || 20;

  const result = await StockMovementService.getAll(page, limit);
  return NextResponse.json(result);
}


  static async getByProduct(productId: string) {
    const data = await StockMovementService.getByProduct(productId);
    return NextResponse.json(data);
  }

  static async getByVariation(variationId: string) {
    const data = await StockMovementService.getByVariation(variationId);
    return NextResponse.json(data);
  }

  static async getByOrder(token: string) {
    const data = await StockMovementService.getByOrder(token);
    return NextResponse.json(data);
  }
}
