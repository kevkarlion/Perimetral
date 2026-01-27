export interface IAttribute {
  nombre: string;
  valor: string;
}

export interface IVariation {
  _id: string;
  codigo?: string;
  productId:
  | string
  | {
      _id: string;
      nombre: string;
      categoria?: {
        _id: string;
        nombre: string;
      };
    };

  nombre: string;
  descripcion?: string;
  medida?: string;
  uMedida?: string; // unidad de medida
  precio: number;
  stock?: number;
  stockMinimo?: number;
  atributos?: IAttribute[];
  imagenes: string[];
  activo: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface IVariationDetail extends IVariation {
  productNombre: string;
  categoriaId?: string;
  categoriaNombre?: string;
}


export interface ProductFormData {
  _id?: string
  nombre: string
  codigoPrincipal: string
  proveedor?: string
  descripcionCorta: string
  descripcionLarga?: string
  categoria: string // solo el _id de la categoría
  tieneVariaciones: boolean
  activo: boolean
  imagen?: string
  variaciones?: IVariation[]
}

export interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  onSubmit: (data: ProductFormData) => void
  onClose?: () => void
  type?: "new" | "edit"
}

export interface VariationFormProps {
  productId: string
  initialData?: Partial<IVariation>
  onSubmit: (data: IVariation) => void
  onClose?: () => void
  type?: "new" | "edit"
}
