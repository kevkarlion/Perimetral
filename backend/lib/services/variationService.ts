// File: backend/lib/services/variationService.ts
import { Types } from "mongoose";
import Variation from "@/backend/lib/models/VariationModel";
import Product from "@/backend/lib/models/Product";
import { UpdateVariationDTO } from '@/backend/lib/dto/variation'

export const variationService = {
  async create(data: any) {
    if (!data.product) {
      throw new Error("El producto es obligatorio");
    }

    if (!Types.ObjectId.isValid(data.product)) {
      throw new Error("ID de producto inválido");
    }

    const productExists = await Product.exists({
      _id: data.product,
      activo: true,
    });

    if (!productExists) {
      throw new Error("El producto no existe o está inactivo");
    }

    if (!data.codigo) {
      throw new Error("El código de variación es obligatorio");
    }

    if (!data.nombre) {
      throw new Error("El nombre de la variación es obligatorio");
    }

    if (data.precio === undefined) {
      throw new Error("El precio es obligatorio");
    }

    if (data.stock === undefined) {
      throw new Error("El stock es obligatorio");
    }

    if (!data.imagenes || data.imagenes.length === 0) {
      throw new Error("Debe incluir al menos una imagen");
    }

    return Variation.create({
      product: data.product,
      codigo: data.codigo,
      nombre: data.nombre,
      descripcion: data.descripcion,
      medida: data.medida,
      uMedida: data.uMedida,
      precio: data.precio,
      stock: data.stock,
      stockMinimo: data.stockMinimo ?? 5,
      atributos: data.atributos ?? [],
      imagenes: data.imagenes,
      activo: data.activo ?? true,
    });
  },

  async getByProduct(productId: string) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error("ID de producto inválido");
    }

    return Variation.find({
      product: productId,
      activo: true,
    }).sort({ createdAt: 1 });
  },



  async getById(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error("ID de variación inválido");
  }
  const variation = await Variation.findById(id).populate(
    "product",
    "nombre codigoPrincipal"
  );
  if (!variation) {
    throw new Error("Variación no encontrada");
  }
  return variation;
},


  async update(id: string, data: UpdateVariationDTO) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID de variación inválido");
    }

    if (data.precio !== undefined && data.precio < 0) {
      throw new Error("El precio no puede ser negativo");
    }

    if (data.stock !== undefined && data.stock < 0) {
      throw new Error("El stock no puede ser negativo");
    }

    const variation = await Variation.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!variation) {
      throw new Error("Variación no encontrada");
    }

    return variation;
  },


  
  async deactivate(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID de variación inválido");
    }

    const variation = await Variation.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!variation) {
      throw new Error("Variación no encontrada");
    }

    return variation;
  },



};



