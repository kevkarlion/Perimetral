// backend/lib/controllers/stockMovementController.ts
import { NextResponse } from "next/server";

// Services de movimientos de stock
import { StockMovementService } from "@/backend/lib/services/StockMovement";



export class StockMovementController {
  static async getAll() {
    const data = await StockMovementService.getAll();
    return NextResponse.json(data);
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
