export interface UpdateProductDTO {
  nombre?: string;
  descripcionCorta?: string;
  descripcionLarga?: string;
  proveedor?: string;
  destacado?: boolean;
  activo?: boolean;
  categoria?: string;
}


export interface CreateProductDTO {
  nombre: string;
  codigoPrincipal: string;
  categoria: string; // viene como string desde el cliente
  descripcionCorta?: string;
  descripcionLarga?: string;
  proveedor?: string;
  destacado?: boolean;
  activo?: boolean;
}