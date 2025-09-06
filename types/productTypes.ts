import { Types, Document, FlattenMaps } from "mongoose";

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}


// 🔹 Tipos base de variación
export interface IVariationBase {
  codigo: string;
  productId?: string | Types.ObjectId; // Nueva referencia al producto
  nombre?: string;
  descripcion?: string;
  medida?: string;
  precio: number;
  stock: number;
  stockMinimo?: number;
  length?: number;
  atributos?: IAttribute[]; // Ahora es un array dinámico
  imagenes?: string[];
  activo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVariation extends IVariationBase {
  _id?: string | Types.ObjectId;
}

export interface IVariationDocument extends IVariationBase, Document {
  _id: Types.ObjectId;
}

// 🔹 Tipos base de producto
export interface IProductBase {
  _id: Types.ObjectId | string;
  codigoPrincipal: string;
  medida?: string;
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

export interface IProductDocument extends IProductBase, Document {
  _id: Types.ObjectId;
  variaciones: Types.Array<IVariationDocument>;
}

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

export type IProduct = IProductBase | IProductLean | FlattenMaps<IProductLean>;

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

// 🔹 Formularios
export interface ProductFormData {
  codigoPrincipal: string;
  nombre: string;
  medida?: string;
  categoria: string;
  descripcionCorta: string;
  descripcionLarga: string;
  imagenesGenerales: string[];
  precio?: number;
  stock?: number;
  stockMinimo: number;
  tieneVariaciones: boolean;
  variaciones: VariationFormData[];
  destacado: boolean;
  especificacionesTecnicas: string[];
  caracteristicas: string[];
  proveedor: string;
  activo: boolean;
}


// 🔹 Tipado de Atributo dinámico
export interface IAttribute {
  nombre: string;
  valor: string; // solo string
}

export interface VariationFormData {
  codigo?: string;
  productId?: string;
  nombre?: string;
  descripcion?: string;
  medida?: string;
  precio: number;
  stock?: number;
  stockMinimo?: number;
  imagenes?: string[];
  atributos?: IAttribute[];
}


