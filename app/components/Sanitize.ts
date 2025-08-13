import { IProductSerialized, IProduct } from "@/types/productTypes";

export default function sanitizeProduct(
  product: IProduct & { medidaSeleccionada: string }
): IProductSerialized & { medidaSeleccionada: string } {
  return {
    ...product,
    _id: product._id?.toString(),
    createdAt: product.createdAt ? product.createdAt.toISOString() : null,
    updatedAt: product.updatedAt ? product.updatedAt.toISOString() : null,
    medidaSeleccionada: product.medidaSeleccionada,

    categoria: product.categoria
      ? {
          _id: product.categoria._id.toString(),
          nombre: product.categoria.nombre,
        }
      : null,

    variaciones: product.variaciones.map((v) => ({
      ...v,
      _id: v._id?.toString(),
      createdAt: v.createdAt ? v.createdAt.toISOString() : null,
      updatedAt: v.updatedAt ? v.updatedAt.toISOString() : null,
    })),

    especificacionesTecnicas: product.especificacionesTecnicas || [],
    caracteristicas: product.caracteristicas || [],
    imagenesGenerales: product.imagenesGenerales || [],
    atributos: product.atributos,
  };
}
