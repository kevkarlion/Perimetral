// File: backend/lib/services/variationService.ts
import { Types } from "mongoose";
import Variation from "@/backend/lib/models/VariationModel";
import Product from "@/backend/lib/models/Product";
import { UpdateVariationDTO } from "@/backend/lib/dto/variation";
import StockMovement from "@/backend/lib/models/StockMovement";
import { StockMovementService } from "@/backend/lib/herlpers/stockMovementService";

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

    if (!data.codigo) throw new Error("El código de variación es obligatorio");
    if (!data.nombre)
      throw new Error("El nombre de la variación es obligatorio");
    if (data.precio === undefined) throw new Error("El precio es obligatorio");
    if (data.stock === undefined) throw new Error("El stock es obligatorio");

    if (!data.imagenes || data.imagenes.length === 0) {
      throw new Error("Debe incluir al menos una imagen");
    }

    // 1️⃣ Crear variación
    const variation = await Variation.create({
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

    // 2️⃣ Movimiento inicial de stock
    if (variation.stock > 0) {
      await StockMovementService.createMovement({
        productId: new Types.ObjectId(variation.product),
        variationId: variation._id,
        type: "IN",
        reason: "MANUAL",
        quantity: variation.stock,
        previousStock: 0,
        newStock: variation.stock,
      });
    }

    return variation;
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
      "nombre codigoPrincipal",
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

    // 1️⃣ Buscar la variación antes de actualizar
    const variation = await Variation.findById(id);
    if (!variation) throw new Error("Variación no encontrada");

    // 2️⃣ Si hay cambio de stock, registrar movimiento
    if (data.stock !== undefined && data.stock !== variation.stock) {
      const previousStock = variation.stock;
      const newStock = data.stock;
      const quantity = Math.abs(newStock - previousStock);
      const type = newStock > previousStock ? "IN" : "OUT";

      await StockMovementService.createMovement({
        productId: variation.product,
        variationId: variation._id,
        type,
        reason: "ADJUSTMENT", // se puede cambiar según el caso
        quantity,
        previousStock,
        newStock,
      });
    }

    // 3️⃣ Actualizar la variación
    Object.assign(variation, data);
    await variation.save();

    return variation;
  },

  async deactivate(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("ID de variación inválido");
    }

    const variation = await Variation.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true },
    );

    if (!variation) {
      throw new Error("Variación no encontrada");
    }

    return variation;
  },

  async decrementStock(
    variationId: Types.ObjectId,
    quantity: number,
    meta?: { orderToken?: string; productId?: Types.ObjectId },
  ) {
    const variation = await Variation.findById(variationId);
    if (!variation) throw new Error("Variación no encontrada");

    const previousStock = variation.stock;

    if (previousStock < quantity) {
      throw new Error("Stock insuficiente");
    }

    const newStock = previousStock - quantity;

    // 1️⃣ Actualizar stock
    variation.stock = newStock;
    await variation.save();

    // 2️⃣ Registrar movimiento
    await StockMovement.create({
      productId: meta?.productId,
      variationId,
      type: "OUT",
      reason: "SALE",
      quantity,
      previousStock,
      newStock,
      orderToken: meta?.orderToken,
    });

    return { previousStock, newStock };
  },
};
