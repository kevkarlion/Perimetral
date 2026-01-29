// types/variation.backend.ts
import { Types, Document } from "mongoose";

export interface IVariationAttributeBackend {
  nombre: string;
  valor: string;
}

export interface IVariationBackend {
  product: Types.ObjectId;
  codigo: string;
  nombre: string;
  descripcion?: string;
  medida?: string;
  uMedida?: string;
  precio: number;
  stock: number;
  stockMinimo?: number;
  atributos?: IVariationAttributeBackend[];
  imagenes: string[];
  activo?: boolean;
  destacada?: boolean;
  descuento?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IVariationDocument
  extends IVariationBackend,
    Document {
  _id: Types.ObjectId;
}
