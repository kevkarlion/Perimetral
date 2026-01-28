import { Schema, model, models, Types } from "mongoose";
import crypto from "crypto";
import { IProductBase } from "@/types/productTypes";

const ProductSchema = new Schema<IProductBase>(
  {
    codigoPrincipal: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: () =>
        "PRD-" + crypto.randomBytes(3).toString("hex").toUpperCase(),
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

    imagenes: {
      type: [String],
      default: [],
    },

    destacado: {
      type: Boolean,
      default: false,
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// SKU + SLUG AUTOMÁTICOS
ProductSchema.pre("validate", function (next) {
  // SKU
  if (!this.codigoPrincipal) {
    this.codigoPrincipal =
      "PRD-" + crypto.randomBytes(3).toString("hex").toUpperCase();
  }

  // Slug
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
