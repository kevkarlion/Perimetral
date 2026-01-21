import { Document, Types } from "mongoose";

export interface ICategoria {
  nombre: string;
  slug: string;
  descripcion?: string;
  activo: boolean;
  parentId?: Types.ObjectId | null;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Documento Mongoose
 */
export interface CategoriaDocument extends ICategoria, Document {
  _id: Types.ObjectId;
}

/**
 * DTO para frontend / API
 */
export type CategoriaDTO = {
  _id: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  activo: boolean;
  parentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
};
