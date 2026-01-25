// backend/lib/services/stockMovementService.ts
import StockMovement from "@/backend/lib/models/StockMovement";
import { Schema, Types } from "mongoose";

// Importar modelos necesarios
import "@/backend/lib/models/Product";
import "@/backend/lib/models/VariationModel";
import "@/backend/lib/models/StockMovement";


export class StockMovementService {
  static async createMovement(data: {
    productId: { type: Schema.Types.ObjectId, ref: "Product" };
    variationId: { type: Schema.Types.ObjectId, ref: "Variation" };
    type: "IN" | "OUT";
    reason: "SALE" | "MANUAL" | "ADJUSTMENT";
    quantity: number;
    previousStock: number;
    newStock: number;
    orderToken?: string;
  }) {
    return StockMovement.create(data);
  }

  static async getAll() {
    return StockMovement.find()
      .sort({ createdAt: -1 })
      .populate("productId", "name")
      .populate("variationId", "sku medida");
  }

  static async getByProduct(productId: string) {
    return StockMovement.find({
      productId: new Types.ObjectId(productId),
    }).sort({ createdAt: -1 });
  }

  static async getByVariation(variationId: string) {
    return StockMovement.find({
      variationId: new Types.ObjectId(variationId),
    }).sort({ createdAt: -1 });
  }

  static async getByOrder(token: string) {
    return StockMovement.find({ orderToken: token }).sort({
      createdAt: -1,
    });
  }
}
