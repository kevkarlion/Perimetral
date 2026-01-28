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
export interface IVariation {
  _id: string;
  product: string;
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
  destacada?: boolean;
  descuento?: string;

  createdAt?: string;
  updatedAt?: string;
}
