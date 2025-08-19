// lib/types/productTypes.ts
import { Types, Document, FlattenMaps, ObjectId } from "mongoose";

export interface ServiceResponse<T> {
  success: boolean;
  data?: T; // aquí va tu IProduct completo
  error?: string;
  details?: string;
}

// Tipos base
export interface IVariationBase {
  codigo: string;
  descripcion?: string;
  medida: string;
  precio: number;
  stock: number;
  stockMinimo?: number;
  length?: number;
  atributos?: {
    longitud?: number;
    altura?: number;
    calibre?: string;
    material?: string;
    color?: string;
  };
  imagenes?: string[];
  activo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Para objetos planos (con _id como string o ObjectId)
export interface IVariation extends IVariationBase {
  _id?: string | Types.ObjectId;
}

// Para documentos Mongoose
export interface IVariationDocument extends IVariationBase, Document {
  _id: Types.ObjectId;
}

// Tipos base de producto
export interface IProductBase {
  _id: Types.ObjectId | string;
  codigoPrincipal: string;
  medida: string;
  nombre: string;
  categoria?:
    | Types.ObjectId
    | {
        _id: Types.ObjectId | string;
        nombre: string;
      }
    | null;
  descripcionCorta: string;
  descripcionLarga?: string;
  precio?: number;
  stock?: number;
  stockMinimo?: number;
  tieneVariaciones: boolean;
  variaciones?: IVariation[];
  especificacionesTecnicas?: string[];
  caracteristicas?: string[];
  imagenesGenerales?: string[];
  proveedor?: string;
  destacado?: boolean;
  activo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Para documentos Mongoose completos
export interface IProductDocument extends IProductBase, Document {
  _id: Types.ObjectId;
  variaciones: Types.Array<IVariationDocument>;
}

// Para objetos planos (resultados de .lean())
export interface IProductLean extends Omit<IProductBase, "categoria"> {
  _id: Types.ObjectId;
  variaciones: IVariation[];
  categoria?:
    | Types.ObjectId
    | {
        _id: Types.ObjectId;
        nombre: string;
      };
  __v?: number;
}

// Tipo combinado para uso general
export type IProduct = IProductBase | IProductLean | FlattenMaps<IProductLean>;

// Tipo para API (con IDs como strings)
export interface IProductApi
  extends Omit<IProductBase, "_id" | "categoria" | "variaciones"> {
  _id: string;
  categoria: { _id: string; nombre: string } | null;
  variaciones: Array<IVariation & { _id: string }>;
}

export type ApiErrorResponse = {
  error: string;
  details?: string;
  fieldErrors?: Record<string, string>;
};

export interface ProductFormData {
  codigoPrincipal: string;
  nombre: string;
  medida: string;
  categoria: string; // O podría ser Types.ObjectId si usas MongoDB
  descripcionCorta: string;
  descripcionLarga: string;
  imagenesGenerales: string[];
  precio?: number; // Opcional porque puede ser undefined
  stock?: number; // Opcional porque puede ser undefined
  stockMinimo: number;
  tieneVariaciones: boolean;
  variaciones: VariationFormData[];
  destacado: boolean;
  especificacionesTecnicas: string[];
  caracteristicas: string[];
  proveedor: string;
  activo: boolean;
}

interface VariationFormData {
  // Añade aquí los campos de tus variaciones si son necesarios
  medida: string;
  precio: number;
  stock?: number;
  stockMinimo?: number;
  codigo?: string;
  imagenes?: string[];
  atributos?: {
    longitud?: number;
    altura?: number;
    calibre?: string;
    material?: string;
    color?: string;
  };
}
