import { Types } from "mongoose";

export interface LeanCategoria {
  _id: Types.ObjectId;
  nombre: string;
}

export interface LeanProduct {
  _id: Types.ObjectId;
  nombre: string;
  codigoPrincipal: string;
  categoria: {
    _id: Types.ObjectId;
    nombre: string;
  };
}

export interface LeanVariation {
  _id: Types.ObjectId;
  nombre: string;
  medida: string;
  stock: number;
  stockMinimo: number;
  precio: number;
  activo: boolean;
  product: Types.ObjectId;
}

export interface InventoryOverviewDTO {
  _id: string;
  nombre: string;
  productos: {
    _id: string;
    nombre: string;
    codigoPrincipal: string;
    variaciones: {
      _id: string;
      nombre: string;
      medida: string;
      stock: number;
      stockMinimo: number;
      precio: number;
      alerta: boolean;
    }[];
  }[];
}
