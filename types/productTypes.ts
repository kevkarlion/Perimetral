import { Types } from "mongoose";

export interface IProductBase {
  _id: Types.ObjectId | string;
  codigoPrincipal: string;
  nombre: string;

  slug?: string;

  categoria:
    | Types.ObjectId
    | { _id: Types.ObjectId | string; nombre: string }
    | null;

  descripcionCorta?: string;
  descripcionLarga?: string;

  proveedor?: string;
  destacado?: boolean;
  activo?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
