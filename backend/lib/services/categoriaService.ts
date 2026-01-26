// backend/lib/services/categoriaService.ts
import Categoria from "@/backend/lib/models/Categoria";
import { ICategoria } from "@/types/categoria";
import { Types } from "mongoose";

export const categoriaService = {
  async create(data: Partial<ICategoria>) {
    if (!data.nombre) {
      throw new Error("El nombre de la categoría es obligatorio");
    }

    if (data.parentId) {
      const parentExists = await Categoria.exists({
        _id: data.parentId,
      });

      if (!parentExists) {
        throw new Error("La categoría padre no existe");
      }
    }

    const categoria = await Categoria.create({
      nombre: data.nombre,
      descripcion: data.descripcion,
      imagen: data.imagen ?? null, // 👈 AHORA SE GUARDA
      parentId: data.parentId ?? null,
      activo: data.activo ?? true,
    });

    return categoria;
  },

  async getAll() {
    return Categoria.find()
      .populate("parentId", "nombre slug")
      .sort({ createdAt: 1 });
  },

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID de categoría inválido");
    }

    const categoria = await Categoria.findById(id).populate(
      "parentId",
      "nombre slug",
    );

    if (!categoria) {
      throw new Error("Categoría no encontrada");
    }

    return categoria;
  },

  async getRoots() {
    return Categoria.find({ parentId: null, activo: true }).sort({
      nombre: 1,
    });
  },

  async getChildren(parentId: string) {
    if (!Types.ObjectId.isValid(parentId)) {
      throw new Error("ID de categoría inválido");
    }

    return Categoria.find({
      parentId,
      activo: true,
    }).sort({ nombre: 1 });
  },

  async update(id: string, data: Partial<ICategoria>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID de categoría inválido");
    }

    const categoria = await Categoria.findById(id);
    if (!categoria) {
      throw new Error("Categoría no encontrada");
    }

    // Validar parentId si viene
    if (data.parentId) {
      if (!Types.ObjectId.isValid(data.parentId)) {
        throw new Error("ID de categoría padre inválido");
      }

      const parentExists = await Categoria.exists({ _id: data.parentId });
      if (!parentExists) {
        throw new Error("La categoría padre no existe");
      }

      categoria.parentId = data.parentId as any;
    } else if (data.parentId === null) {
      categoria.parentId = null;
    }

    // Actualizar campos opcionales
    if (data.nombre !== undefined) categoria.nombre = data.nombre;
    if (data.descripcion !== undefined)
      categoria.descripcion = data.descripcion;
    if (data.activo !== undefined) categoria.activo = data.activo;

    await categoria.save();

    return categoria;
  },

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID de categoría inválido");
    }

    const categoria = await Categoria.findByIdAndDelete(id);

    if (!categoria) {
      throw new Error("Categoría no encontrada");
    }

    return true; // confirmación
  },
};
