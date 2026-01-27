import { Types, Document } from "mongoose";

/**
 * Atributo dinámico de una variación
 * Ej: Material: Acero galvanizado
 */
export interface IVariationAttribute {
  nombre: string;
  valor: string | number | boolean;
}

/**
 * Variación (entidad vendible)
 */
export interface IVariationBase {
  _id?: Types.ObjectId | string;
  product: Types.ObjectId | string;
  codigo: string;
  nombre: string;
  descripcion?: string;
  medida?: string;
  uMedida?: string;
  precio: number;
  stock: number;
  stockMinimo?: number;
  atributos?: IVariationAttribute[];
  imagenes: string[];
  activo?: boolean;

  // ✅ NUEVOS CAMPOS
  destacada?: boolean;
  descuento?: string; // texto representativo

  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Documento Mongoose
 */
export interface IVariationDocument
  extends IVariationBase,
    Document {
  _id: Types.ObjectId;
}
