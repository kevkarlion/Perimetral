// lib/types/productTypes.ts
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

export interface IProduct {
  _id: string;
  codigoPrincipal: string;
  nombre: string;
  categoria: string;
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