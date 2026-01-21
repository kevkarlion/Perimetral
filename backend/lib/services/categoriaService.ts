// backend/lib/services/categoriaService.ts
import CategoriaSchema from "@/backend/lib/models/Categoria";
import { ICategoria } from "@/types/categoria";
import { Types } from "mongoose";

export const categoriaService = {
  async create(data: Partial<ICategoria>) {
    if (!data.nombre) {
      throw new Error("El nombre de la categoría es obligatorio");
    }

    if (data.parentId) {
      const parentExists = await CategoriaSchema.exists({
        _id: data.parentId,
      });

      if (!parentExists) {
        throw new Error("La categoría padre no existe");
      }
    }

    const categoria = await CategoriaSchema.create({
      nombre: data.nombre,
      descripcion: data.descripcion,
      parentId: data.parentId ?? null,
      activo: data.activo ?? true,
    });

    return categoria;
  },

  async getAll() {
    return CategoriaSchema.find()
      .populate("parentId", "nombre slug")
      .sort({ createdAt: 1 });
  },

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID de categoría inválido");
    }

    const categoria = await CategoriaSchema.findById(id).populate(
      "parentId",
      "nombre slug"
    );

    if (!categoria) {
      throw new Error("Categoría no encontrada");
    }

    return categoria;
  },

  async getRoots() {
    return CategoriaSchema.find({ parentId: null, activo: true }).sort({
      nombre: 1,
    });
  },

  async getChildren(parentId: string) {
    if (!Types.ObjectId.isValid(parentId)) {
      throw new Error("ID de categoría inválido");
    }

    return CategoriaSchema.find({
      parentId,
      activo: true,
    }).sort({ nombre: 1 });
  },
};
