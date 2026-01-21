import Product from "@/backend/lib/models/Product";
import Categoria from "@/backend/lib/models/Categoria";
import { Types } from "mongoose";
import { IProductBase } from "@/types/productTypes";
import { UpdateProductDTO } from '@/backend/lib/dto/product'
import Variation from "@/backend/lib/models/Variation";

export const productService = {
  async create(data: Partial<IProductBase>) {
    if (!data.nombre) {
      throw new Error("El nombre del producto es obligatorio");
    }

    if (!data.codigoPrincipal) {
      throw new Error("El código principal es obligatorio");
    }

    if (!data.categoria) {
      throw new Error("La categoría es obligatoria");
    }

    if (!Types.ObjectId.isValid(String(data.categoria))) {
      throw new Error("ID de categoría inválido");
    }

    const categoriaExists = await Categoria.exists({
      _id: data.categoria,
      activo: true,
    });

    if (!categoriaExists) {
      throw new Error("La categoría no existe o está inactiva");
    }

    const product = new Product({
      codigoPrincipal: data.codigoPrincipal,
      nombre: data.nombre,
      categoria: data.categoria,
      descripcionCorta: data.descripcionCorta,
      descripcionLarga: data.descripcionLarga,
      proveedor: data.proveedor,
      destacado: data.destacado ?? false,
      activo: data.activo ?? true,
    });

    await product.save();

    return product;
  },

  async getAll() {
    return Product.find({ activo: true })
      .populate("categoria", "nombre slug")
      .sort({ createdAt: -1 });
  },

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID de producto inválido");
    }

    const product = await Product.findById(id).populate(
      "categoria",
      "nombre slug",
    );

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return product;
  },


async update(id: string, data: UpdateProductDTO) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID de producto inválido");
    }

    if (data.categoria) {
      if (!Types.ObjectId.isValid(data.categoria)) {
        throw new Error("ID de categoría inválido");
      }

      const exists = await Categoria.exists({
        _id: data.categoria,
        activo: true,
      });

      if (!exists) {
        throw new Error("La categoría no existe o está inactiva");
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    return product;
  },

  async deactivate(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID inválido");
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    // 🔥 cascada: desactivar variaciones
    await Variation.updateMany(
      { product: product._id },
      { activo: false }
    );

    return product;
  },





 





};
