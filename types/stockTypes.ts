// backend/lib/types/stockTypes.ts
import { Types, Document } from "mongoose";

export interface IStockMovementBase {
  productId: Types.ObjectId | string;
  variationId?: Types.ObjectId | string;
  type: 'in' | 'out' | 'adjustment' | 'transfer' | 'initial';
  quantity: number;
  previousStock: number; // ✅ Hacer obligatorio
  newStock: number; // ✅ Hacer obligatorio
  reason: string;
  reference?: {
    type: 'order' | 'purchase' | 'adjustment' | 'transfer';
    id: Types.ObjectId | string;
  };
  notes?: string;
  createdBy?: Types.ObjectId | string;
  
  // NUEVOS CAMPOS - Información rápida
  productName?: string;
  productCode?: string;
  categoryName?: string;
  variationName?: string;
  variationCode?: string;
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
  productId: string;
  variationId?: string;
  type: 'in' | 'out' | 'adjustment' | 'transfer' | 'initial';
  quantity: number;
  previousStock: number; // ✅ Añadir este campo
  newStock: number; // ✅ Añadir este campo
  reason: string;
  reference?: {
    type: 'order' | 'purchase' | 'adjustment' | 'transfer';
    id: string;
  };
  notes?: string;
  createdBy?: string;
  
  // NUEVOS CAMPOS - Información rápida
  productName?: string;
  productCode?: string;
  categoryName?: string;
  variationName?: string;
  variationCode?: string;
}

export interface StockMovementFilter {
  productId?: string;
  variationId?: string;
  type?: string;
  productName?: string;
  categoryName?: string;
  variationName?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;        // ← Este es el problema
  limit?: number;       // ← Este es el problema
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


