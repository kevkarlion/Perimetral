import { Schema, model, models, Document } from "mongoose";
import type {
  IProduct as IProductType,
  IVariation as IVariationType,
  IAttribute
} from "@/types/productTypes";
import { HydratedDocument } from "mongoose";

type IVariationDoc = IVariationType & Document;
type IProductDoc = IProductType & Document;

// 🔹 Sub-esquema de Atributos
const AttributeSchema = new Schema<IAttribute>(
  {
    nombre: { type: String, required: true, trim: true },
    valor: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

// 🔹 Sub-esquema de Variaciones (ACTUALIZADO - imágenes movidas aquí)
const VariationSchema = new Schema<IVariationDoc>(
  {
    codigo: { type: String, required: true, unique: true, sparse: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    nombre: { type: String, trim: true },
    descripcion: String,
    medida: { type: String },
    uMedida: { type: String },
    precio: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    stockMinimo: { type: Number, min: 0, default: 5 },
    atributos: { type: [AttributeSchema], default: [] },
    imagenes: [String], // ✅ Imágenes ahora en variaciones
    activo: { type: Boolean, default: true },
  },
  { _id: true, timestamps: true }
);

// 🔹 Esquema principal de Producto (ACTUALIZADO - imagenesGenerales ELIMINADO)
const ProductSchema = new Schema<IProductDoc>(
  {
    codigoPrincipal: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    categoria: {
      type: Schema.Types.ObjectId,
      ref: "Categoria",
      required: true,
    },
    medida: { type: String },
    uMedida: { type: String },
    precio: { type: Number, min: 0 },
    stock: { type: Number, min: 0, default: 0 },
    stockMinimo: { type: Number, min: 0, default: 5 },
    tieneVariaciones: { type: Boolean, required: true, default: false },
    variaciones: { type: [VariationSchema], default: [] },
    descripcionCorta: String,
    descripcionLarga: String,
    especificacionesTecnicas: [String],
    caracteristicas: [String],
    // ❌ imagenesGenerales ELIMINADO - ahora las imágenes están en variaciones
    proveedor: String,
    destacado: { type: Boolean, default: false },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// 🔹 Pre-save hook para validar variaciones
ProductSchema.pre("save", function (this: HydratedDocument<IProductDoc>, next) {
  if (this.tieneVariaciones) {
    this.set("precio", undefined, { strict: false });
    this.set("stock", undefined, { strict: false });
    this.set("stockMinimo", undefined, { strict: false });

    if (!this.variaciones || this.variaciones.length === 0) {
      return next(
        new Error("Productos con variaciones deben tener al menos una variación")
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

const Product = models.Product || model<IProductDoc>("Product", ProductSchema);

export default Product;