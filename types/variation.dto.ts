// types/variation.dto.ts
export interface VariationDTO {
  _id: string;

  productId: string;
  productNombre: string;

  categoriaId?: string;
  categoriaNombre?: string;

  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  medida?: string;
  uMedida?: string;
  imagenes: string[];
  atributos?: { nombre: string; valor: string }[];
  activo?: boolean;
  destacada?: boolean;
  descuento?: string;

  createdAt?: string;
  updatedAt?: string;
}
