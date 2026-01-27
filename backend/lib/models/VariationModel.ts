import { Schema, model, models, Types } from "mongoose";
import { IVariationDocument } from "@/types/variationsTypes";

// 🔹 Subschema de atributos
// 🔹 Subschema de atributos
const AttributeSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true }, // ej: "Material", "Color"
    valor: { type: String, required: true, trim: true },  // ej: "Acero galvanizado", "Rojo"
  },
  { _id: false },
)


// 🔹 Schema principal de Variación
const VariationSchema = new Schema<IVariationDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    codigo: { type: String, required: true, unique: true, trim: true },
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    medida: { type: String, trim: true },
    uMedida: { type: String, trim: true },
    precio: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    stockMinimo: { type: Number, default: 5, min: 0 },
    atributos: { type: [AttributeSchema], default: [] },
    imagenes: { type: [String], required: true },
    activo: { type: Boolean, default: true },

    // ✅ NUEVOS CAMPOS
    destacada: { type: Boolean, default: false },
    descuento: { type: String, default: "" }, // texto representativo
  },
  {
    timestamps: true,
  },
);


export default models.Variation ||
  model<IVariationDocument>("Variation", VariationSchema);
