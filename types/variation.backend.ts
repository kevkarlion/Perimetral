import { Types, Document } from "mongoose";

/**
 * Atributo dinámico de una variación (backend)
 */
export interface IVariationAttributeBackend {
  nombre: string;
  valor: string;
}

/**
 * Base de la variación en Mongo
 */
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

/**
 * Documento Mongoose
 */
export interface IVariationDocument
  extends IVariationBackend,
    Document {
  _id: Types.ObjectId;
}
