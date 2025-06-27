// lib/models/Product.ts
import { Schema, model, models, Document } from 'mongoose';

interface IVariation {
  medida: string;
  price: number;
  stock: number;
  sku: string; // Identificador único
}

interface IProduct extends Document {
  name: string;
  description: string;
  basePrice: number;
  stock: number; // Stock para productos sin variaciones
  salesCount: number;
  category: string;
  image?: string;
  variaciones: IVariation[];
}

const VariationSchema = new Schema<IVariation>({
  medida: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, min: 0 },
  sku: { type: String, required: true, unique: true }
});

const ProductSchema = new Schema<IProduct>({
  id: { type: String, required: true, unique: true }, // ID público como string
  name: { type: String, required: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0, min: 0 },
  salesCount: { type: Number, default: 0 },
  category: { type: String, required: true },
  image: { type: String },
  variaciones: { type: [VariationSchema], default: [] }
}, { timestamps: true });

const Product = models.Product || model<IProduct>('Product', ProductSchema);
export default Product;