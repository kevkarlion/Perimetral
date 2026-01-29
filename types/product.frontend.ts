// types/product.frontend.ts
// types/product.frontend.ts
export interface IProductBase {
  _id: string;
  nombre: string;
  slug?: string;
  categoria?: {
    _id: string;
  };
  descripcionCorta?: string;
  descripcionLarga?: string;
  proveedor?: string;
  destacado?: boolean;
  activo?: boolean;
  imagenes?: string[];   // ← ESTA LÍNEA
}


export interface IProductPopulated extends Omit<IProductBase, "categoria"> {
  categoria?: {
    _id: string
    nombre: string
  }
}
