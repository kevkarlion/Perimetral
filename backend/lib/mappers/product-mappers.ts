// mappers/product.mapper.ts
import { Types } from "mongoose";
import { IProductBase } from "@/types/productTypes";

export function mapCreateProductToDomain(body: any): Partial<IProductBase> {
  if (!body.nombre) throw new Error("El nombre es obligatorio");
  if (!body.codigoPrincipal)
    throw new Error("El código principal es obligatorio");

  const categoria =
    typeof body.categoria === "string"
      ? body.categoria
      : body.categoria?._id;

  if (!categoria || !Types.ObjectId.isValid(categoria)) {
    throw new Error("ID de categoría inválido");
  }

  // 👇 Normalizamos imágenes
  const imagenes =
    Array.isArray(body.imagenes)
      ? body.imagenes.filter((i: any) => typeof i === "string")
      : [];

  return {
    nombre: body.nombre,
    codigoPrincipal: body.codigoPrincipal,
    categoria: new Types.ObjectId(categoria),
    descripcionCorta: body.descripcionCorta,
    descripcionLarga: body.descripcionLarga,
    proveedor: body.proveedor,
    activo: body.activo ?? true,
    destacado: body.destacado ?? false,
    imagenes, // 👈 ESTA era la que faltaba
  };
}
