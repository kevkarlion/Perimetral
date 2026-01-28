import { Schema, model, models } from "mongoose";
import { IVariationDocument } from "@/types/variation.backend";

const AttributeSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    valor: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const VariationSchema = new Schema<IVariationDocument>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    codigo: { type: String, unique: true, trim: true },

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
    destacada: { type: Boolean, default: false },
    descuento: { type: String, default: "" },
  },
  { timestamps: true },
);

// 🔥 AUTOGENERAR CÓDIGO
VariationSchema.pre("save", async function (next) {
  if (this.codigo) return next();

  const count = await models.Variation.countDocuments();
  this.codigo = `VAR-${String(count + 1).padStart(6, "0")}`;
  next();
});


export default models.Variation ||
  model<IVariationDocument>("Variation", VariationSchema);
