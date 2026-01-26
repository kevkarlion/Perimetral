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

// backend/lib/services/StockMovementService.ts
static async getAll(page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  // Obtener movimientos con paginado
  const movements = await StockMovement.find()
    .populate({
      path: "productId",
      select: "nombre codigoPrincipal",
    })
    .populate({
      path: "variationId",
      select: "nombre medida",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Contar total de documentos para frontend
  const total = await StockMovement.countDocuments();

  return { data: movements, total, page, limit };
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
