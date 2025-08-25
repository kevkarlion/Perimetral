// backend/lib/models/StockMovement.ts
import { Schema, model, models, Document, Types } from "mongoose";

export interface IStockMovement extends Document {
  productId: Types.ObjectId;
  variationId?: Types.ObjectId;
  type: 'in' | 'out' | 'adjustment' | 'transfer' | 'initial';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  reference?: {
    type: 'order' | 'purchase' | 'adjustment' | 'transfer';
    id: Types.ObjectId;
  };
  notes?: string;
  createdBy?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const StockMovementSchema = new Schema<IStockMovement>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variationId: {
    type: Schema.Types.ObjectId,
    ref: 'Product.variaciones',
    required: false
  },
  type: {
    type: String,
    enum: ['in', 'out', 'adjustment', 'transfer', 'initial'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  reference: {
    type: {
      type: String,
      enum: ['order', 'purchase', 'adjustment', 'transfer'],
      required: false
    },
    id: {
      type: Schema.Types.ObjectId,
      required: false
    }
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: false
  }
}, {
  timestamps: true
});

// Índices para mejor performance
StockMovementSchema.index({ productId: 1, createdAt: -1 });
StockMovementSchema.index({ variationId: 1, createdAt: -1 });
StockMovementSchema.index({ type: 1, createdAt: -1 });
StockMovementSchema.index({ 'reference.type': 1, 'reference.id': 1 });

export default models.StockMovement || model<IStockMovement>('StockMovement', StockMovementSchema);