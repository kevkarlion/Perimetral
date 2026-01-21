import { Schema, model, models, Types } from "mongoose";
import { IProductBase } from "@/types/productTypes";

const ProductSchema = new Schema<IProductBase>(
  {
    codigoPrincipal: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    categoria: {
      type: Types.ObjectId,
      ref: "Categoria",
      required: true,
    },

    descripcionCorta: String,
    descripcionLarga: String,

    proveedor: String,
    destacado: {
      type: Boolean,
      default: false,
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

ProductSchema.pre("validate", function (next) {
  if (!this.slug && this.nombre) {
    this.slug = this.nombre
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");
  }

  next();
});

export default models.Product || model("Product", ProductSchema);
