// src/types/categoria.d.ts
import { Document } from 'mongoose';

export interface ICategoria extends Document {
  _id: string;
  nombre: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CategoriaDocument extends Document, Omit<ICategoria, '_id'> {
  _id: Types.ObjectId;
}

export type CategoriaDTO = {
  _id: string;
  nombre: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};
