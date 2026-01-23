import Variation from "@/backend/lib/models/VariationModel";
import Product from "@/backend/lib/models/Product";
import { Types } from "mongoose";
import type { CartItemDTO } from "@/types/orderTypes";



export async function validateCartItems(items: CartItemDTO[]) {
  const variationIds = items.map(i => i.variationId);

  const variations = await Variation.find({
    _id: { $in: variationIds.map(id => new Types.ObjectId(id)) },
    activo: true,
  });

  const validated = [];

  for (const item of items) {
    const variation = variations.find(v => v._id.toString() === item.variationId);
    if (!variation) throw new Error(`Variación no encontrada: ${item.variationId}`);

    const product = await Product.findById(variation.product);
    if (!product) throw new Error(`Producto padre no encontrado`);

    if (variation.stock < item.quantity) {
      throw new Error(`Stock insuficiente para ${variation.nombre}`);
    }

    validated.push({
      productId: product._id,
      variationId: variation._id,
      name: `${product.nombre} - ${variation.nombre}`,
      price: variation.precio,
      quantity: item.quantity,
      image: variation.imagenes?.[0] || "",
      medida: variation.medida,
      sku: variation.codigo,
      stock: variation.stock,
    });
  }

  return validated;
}
