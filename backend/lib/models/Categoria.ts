// src/lib/models/Categoria.ts
import { Schema, model, models, Types } from "mongoose";
import { ICategoria } from "@/types/categoria";

const CategoriaSchema = new Schema<ICategoria>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Categoria",
      default: null,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


CategoriaSchema.pre("validate", async function (next) {
  if (!this.nombre) return next();

  const baseSlug = this.nombre
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  if (this.parentId) {
    const parent = await model("Categoria").findById(this.parentId);
    if (parent) {
      this.slug = `${parent.slug}/${baseSlug}`;
    } else {
      this.slug = baseSlug;
    }
  } else {
    this.slug = baseSlug;
  }

  next();
});



const Categoria =
  models.Categoria || model<ICategoria>("Categoria", CategoriaSchema);

export default Categoria;



