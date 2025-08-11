// lib/types/productTypes.ts

import { Types } from 'mongoose';


export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}


export interface IVariation {
  _id?: string;
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

export interface DBProduct {
  _id: Types.ObjectId;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  images?: string[];
  sku?: string;
  // Agrega aquí otros campos que necesites
}


export interface IProduct {
  _id?: string;
  codigoPrincipal: string;
  nombre: string;
  categoria: Types.ObjectId | string; // Ahora referencia a Categoria
  descripcionCorta: string; // Añade este campo
  descripcionLarga?: string;
  precio?: number;
  stock?: number;
  stockMinimo?: number;
  tieneVariaciones: boolean;
  variaciones: IVariation[];
  especificacionesTecnicas?: string[];
  caracteristicas?: string[];
  imagenesGenerales?: string[];
  proveedor?: string;
  destacado?: boolean;
  activo?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
