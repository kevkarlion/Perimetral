// backend/lib/types/stockTypes.ts
import { Types, Document } from "mongoose";

export interface IStockMovementBase {
  productId: Types.ObjectId | string;
  variationId?: Types.ObjectId | string;
  type: 'in' | 'out' | 'adjustment' | 'transfer' | 'initial';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  reference?: {
    type: 'order' | 'purchase' | 'adjustment' | 'transfer';
    id: Types.ObjectId | string;
  };
  notes?: string;
  createdBy?: Types.ObjectId | string;
}

export interface IStockMovement extends IStockMovementBase {
  _id: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStockMovementDocument extends IStockMovementBase, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovementCreateData {
  productId: string; // Ahora acepta string
  variationId?: string; // Ahora acepta string
  type: 'in' | 'out' | 'adjustment' | 'transfer' | 'initial';
  quantity: number;
  reason: string;
  reference?: {
    type: 'order' | 'purchase' | 'adjustment' | 'transfer';
    id: string; // Ahora acepta string
  };
  notes?: string;
  createdBy?: string; // Ahora acepta string
}

export interface StockMovementFilter {
  productId?: string; // Ahora acepta string
  variationId?: string; // Ahora acepta string
  type?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface StockMovementResponse {
  success: boolean;
  data?: IStockMovement;
  error?: string;
}

export interface StockMovementsResponse {
  success: boolean;
  data: IStockMovement[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
}

export interface StockLevel {
  productId: Types.ObjectId | string;
  variationId?: Types.ObjectId | string;
  currentStock: number;
  minimumStock: number;
  lastMovement?: Date;
}


