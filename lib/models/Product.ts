// lib/models/Product.ts
import { Schema, model, models, Document } from 'mongoose';

interface IVariation {
  medida: string;
  precio: number;  // Cambiado de 'price' a 'precio'
  stock: number;
  sku: string;
}

interface IProduct extends Document {
  id: string;
  nombre: string;  // Cambiado de 'name' a 'nombre'
  descripcionCorta: string;
  descripcionLarga: string;
  categoria: string;  // Cambiado de 'category' a 'categoria'
  imagen: string;
  imagenes: string[];
  imagenesAdicionales: string[];
  precio: string;  // Cambiado de 'basePrice' y tipo Number a String
  tieneVariaciones: boolean;
  destacado: boolean;
  especificaciones: string[];
  caracteristicas: string[];
  stock: number;
  stockMinimo: number;
  variaciones: IVariation[];
  historialStock: any[];
}

const VariationSchema = new Schema<IVariation>({
  medida: { type: String, required: true },
  precio: { type: Number, required: true },  // Cambiado de 'price' a 'precio'
  stock: { type: Number, required: true, min: 0 },
  sku: { type: String, required: true, unique: true }
});

const ProductSchema = new Schema<IProduct>({
  id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  descripcionCorta: { type: String, required: true },
  descripcionLarga: { type: String, required: true },
  categoria: { type: String, required: true },
  imagen: { type: String },
  imagenes: [{ type: String }],
  imagenesAdicionales: [{ type: String }],
  precio: { type: String, required: true },
  tieneVariaciones: { type: Boolean, default: false },
  destacado: { type: Boolean, default: false },
  especificaciones: [{ type: String }],
  caracteristicas: [{ type: String }],
  stock: { type: Number, default: 0, min: 0 },
  stockMinimo: { type: Number, default: 0 },
  variaciones: { type: [VariationSchema], default: [] },
  // historialStock: { type: Array, default: [] }
}, { timestamps: true });

const Product = models.Product || model<IProduct>('Product', ProductSchema);
export default Product;