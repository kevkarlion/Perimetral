// lib/models/Product.ts

import { Schema, model, models, Document } from "mongoose";
import type {
  IProduct as IProductType,
  IVariation as IVariationType,
} from "@/types/productTypes";
import { HydratedDocument } from "mongoose";

// Combinar tus interfaces con Document para los modelos
type IVariationDoc = IVariationType & Document;
type IProductDoc = IProductType & Document;

const VariationSchema = new Schema<IVariationDoc>(
  {
    codigo: { type: String, required: true, unique: true, sparse: true },
    descripcion: String,
    medida: { type: String, required: true },
    precio: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    stockMinimo: { type: Number, min: 0, default: 5 },
    atributos: {
      longitud: Number,
      altura: Number,
      calibre: String,
      material: String,
      color: String,
    },
    imagenes: [String],
    activo: { type: Boolean, default: true },
  },
  { _id: true }
);

const ProductSchema = new Schema<IProductDoc>(
  {
    codigoPrincipal: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: "Categoria", // Referencia al modelo Categoria
      required: true,
    },
    medida: { type: String, required: true },
    precio: { type: Number, min: 0, required: false },
    stock: { type: Number, min: 0, default: 0, required: false },
    stockMinimo: { type: Number, min: 0, default: 5, required: false },

    tieneVariaciones: { type: Boolean, required: true, default: false },
    variaciones: { type: [VariationSchema], default: [] },

    descripcionCorta: String,
    descripcionLarga: String,
    especificacionesTecnicas: [String],
    caracteristicas: [String],
    imagenesGenerales: [String],
    proveedor: String,
    destacado: { type: Boolean, default: false },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Pre-save hook para validar y limpiar campos
ProductSchema.pre("save", function (this: HydratedDocument<IProductDoc>, next) {
  if (this.tieneVariaciones) {
    // Eliminar propiedades innecesarias si tiene variaciones
    this.set("precio", undefined, { strict: false });
    this.set("stock", undefined, { strict: false });
    this.set("stockMinimo", undefined, { strict: false });

    if (!this.variaciones || this.variaciones.length === 0) {
      return next(
        new Error(
          "Productos con variaciones deben tener al menos una variación"
        )
      );
    }
  } else {
    if (this.precio === undefined || this.stock === undefined) {
      return next(
        new Error("Productos sin variaciones requieren precio y stock")
      );
    }
    this.variaciones = [];
  }

  next();
});

// Exportar modelo usando el tipo combinado con Document
const Product = models.Product || model<IProductDoc>("Product", ProductSchema);

export default Product;
