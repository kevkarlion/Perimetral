// lib/types/productTypes.ts
import { Types } from 'mongoose';

export interface IVariation {
  _id?: string | Types.ObjectId;
  codigo: string;
  descripcion?: string;
  medida: string;
  precio: number;
  stock: number;
  stockMinimo?: number;
  atributos?: {
    longitud?: number;
    altura?: number;
    calibre?: string;
    material?: string;
    color?: string;
  };
  imagenes?: string[];
  activo?: boolean;
}

export interface ICategoryRef {
  _id: string | Types.ObjectId;
  nombre: string;
}

export interface IProductBase {
  codigoPrincipal: string;
  nombre: string;
  categoria: string | Types.ObjectId | ICategoryRef | null;
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
}

export interface IProduct extends IProductBase {
  _id?: string | Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductDocument extends IProductBase {
  _id: Types.ObjectId;
  categoria: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductPopulated extends Omit<IProductDocument, 'categoria'> {
  categoria: ICategoryRef | null;
}

export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}