// lib/types/productTypes.ts

import { Types } from "mongoose";

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
  categoria: {
    _id: string;
    nombre: string;
  } | null;
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

export interface ProductFormData {
  codigoPrincipal: string;
  nombre: string;
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

// export interface ProductIdentifier {
//   _id: string | Types.ObjectId;
//   codigoPrincipal: string;
//   nombre: string;
//   categoria: string | Types.ObjectId | { _id: Types.ObjectId; nombre: string };
//   descripcionCorta: string;
//   tieneVariaciones: boolean;
//   variaciones: IVariation[];
// }
