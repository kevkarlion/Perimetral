export interface IProductImage {
  src: string;
  alt: string;
}

export interface IVariation {
  medida: string;
  precio: string;
}

export interface IProduct extends Document {
  id: number;
  nombre: string;
  descripcionCorta: string;
  descripcionLarga: string;
  categoria: string;
  imagen: string;
  imagenes: IProductImage[];
  imagenesAdicionales?: string[]; // Opcional
  precio: string;
  tieneVariaciones: boolean;
  variaciones?: IVariation[]; // Opcional
  destacado: boolean;
  especificaciones: string[];
  caracteristicas: string[];
}