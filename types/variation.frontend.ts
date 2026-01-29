/**
 * Atributo de una variación (frontend)
 */
export interface IVariationAttribute {
  nombre: string;
  valor: string;
}






/**
 * Variación lista para usar en UI
 */
// types/variation.frontend.ts
export interface IVariation {
  _id: string;
  product: string;
  productNombre: string;
  categoriaId?: string;
  categoriaNombre?: string; // 🔹 agregamos
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  medida?: string;
  uMedida?: string;
  imagenes: string[];
  atributos: { nombre: string; valor: string }[];
  activo?: boolean;
  destacada?: boolean;
  descuento?: string;
}
