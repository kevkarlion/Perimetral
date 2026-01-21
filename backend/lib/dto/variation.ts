export interface UpdateVariationDTO {
  nombre?: string;
  descripcion?: string;
  precio?: number;
  stock?: number;
  stockMinimo?: number;
  atributos?: {
    nombre: string;
    valor: string;
  }[];
  imagenes?: string[];
  activo?: boolean;
}
