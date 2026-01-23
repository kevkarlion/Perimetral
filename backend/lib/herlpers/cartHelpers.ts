// backend/lib/helpers/cartHelpers.ts
import Product from "@/backend/lib/models/Product";
import { Types } from "mongoose";

interface CartItem {
  productId: string;
  variationId?: string;
  name?: string;
  price: number;
  quantity: number;
  image?: string;
  medida?: string;
}

export async function validateCartItems(items: CartItem[]) {
  const productIds = items.map(i => i.productId);

  const dbProducts = await Product.find({
    _id: { $in: productIds.map(id => new Types.ObjectId(id)) }
  });

  const validatedItems = [];

  for (const item of items) {
    const product = dbProducts.find(p => p._id.toString() === item.productId);
    if (!product) throw new Error(`Producto no encontrado: ${item.productId}`);
    if (!product.activo) throw new Error(`Producto no disponible: ${product.nombre}`);

    let stock = product.stock;
    let price = product.precio;
    let name = product.nombre;
    let image = product.imagenesGenerales?.[0] || "";

    if (item.variationId) {
      if (!product.tieneVariaciones) {
        console.warn(`Producto ${product.nombre} no tiene variaciones. Ignorando variationId`);
      } else {
        const variation = product.variaciones.find(v => v._id?.toString() === item.variationId);
        if (!variation) throw new Error(`Variación no encontrada: ${item.variationId}`);
        if (!variation.activo) throw new Error(`Variación no disponible: ${variation.descripcion || variation.codigo}`);

        stock = variation.stock;
        price = variation.precio;
        name = `${product.nombre} - ${variation.descripcion || variation.codigo}`;
        image = variation.imagenes?.[0] || image;
      }
    } else if (product.tieneVariaciones) {
      throw new Error(`Producto ${product.nombre} requiere selección de variación`);
    }

    if (stock < item.quantity) {
      throw new Error(`Stock insuficiente para ${name}. Disponible: ${stock}`);
    }

    validatedItems.push({
      ...item,
      name,
      price,
      image,
      stock,
    });
  }

  return validatedItems;
}
