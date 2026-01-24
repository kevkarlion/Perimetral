// backend/lib/services/stockMovementService.ts
import StockMovement from "@/backend/lib/models/StockMovement";
import { Types } from "mongoose";

export class StockMovementService {
  static async createMovement(data: {
    productId: Types.ObjectId;
    variationId: Types.ObjectId;
    type: "IN" | "OUT";
    reason: "SALE" | "MANUAL" | "ADJUSTMENT";
    quantity: number;
    previousStock: number;
    newStock: number;
    orderToken?: string;
  }) {
    return StockMovement.create(data);
  }
}
