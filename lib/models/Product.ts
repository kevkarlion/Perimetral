import { Schema, model, Document } from 'mongoose';

// Interface para TypeScript
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

const ProductSchema = new Schema<IProduct>({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true, trim: true },
  descripcionCorta: { type: String, required: true },
  descripcionLarga: { type: String, required: true },
  categoria: { type: String, required: true, enum: ['Alambrados', 'Postes', 'Accesorios'] }, // Ajusta categorías
  imagen: { type: String, required: true }, // Ej: "/Productos/alambrado.jpg"
  imagenes: [{
    src: { type: String, required: true }, // Ruta relativa desde /public
    alt: { type: String, required: true }
  }],
  imagenesAdicionales: [{ type: String }], // Opcional
  precio: { type: String, required: true }, // Formato: "Desde $XX.XXX"
  tieneVariaciones: { type: Boolean, default: false },
  variaciones: [{
    medida: { type: String, required: true },
    precio: { type: String, required: true }
  }],
  destacado: { type: Boolean, default: false },
  especificaciones: [{ type: String, required: true }],
  caracteristicas: [{ type: String, required: true }]
}, { timestamps: true }); // Añade createdAt y updatedAt automáticos

export default model<IProduct>('Product', ProductSchema);