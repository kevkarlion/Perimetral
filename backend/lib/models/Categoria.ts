import mongoose, { Schema, models, model } from "mongoose";
import { ICategoria } from "@/types/categoria";

const CategoriaSchema = new Schema<ICategoria>(
  {
    nombre: { type: String, required: true, trim: true, maxlength: 50 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    descripcion: { type: String, trim: true, maxlength: 200 },
    parentId: { type: Schema.Types.ObjectId, ref: "Categoria", default: null },
    activo: { type: Boolean, default: true },
    imagen: { type: String, trim: true, default: "" },
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
    const parent = await mongoose.model("Categoria").findById(this.parentId);
    this.slug = parent ? `${parent.slug}/${baseSlug}` : baseSlug;
  } else {
    this.slug = baseSlug;
  }

  next();
});

const Categoria =
  models.Categoria || model<ICategoria>("Categoria", CategoriaSchema);

export default Categoria;
