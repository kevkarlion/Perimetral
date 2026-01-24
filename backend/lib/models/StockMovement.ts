import { Schema, model, models, Types } from "mongoose";

export interface IStockMovement {
  productId: Types.ObjectId;
  variationId: Types.ObjectId;
  type: "IN" | "OUT";
  reason: "SALE" | "MANUAL" | "ADJUSTMENT";
  quantity: number;
  previousStock: number;
  newStock: number;
  orderToken?: string;
  createdAt: Date;
}

const stockMovementSchema = new Schema<IStockMovement>({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variationId: { type: Schema.Types.ObjectId, ref: "Variation", required: true },
  type: { type: String, enum: ["IN", "OUT"], required: true },
  reason: { type: String, required: true },
  quantity: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  orderToken: String,
  createdAt: { type: Date, default: Date.now },
});

export default models.StockMovement ||
  model<IStockMovement>("StockMovement", stockMovementSchema);
