// services/ProductService.ts
import { Types } from "mongoose";
import { ProductFormData } from "@/types/productTypes";
import { StockService } from "@/backend/lib/services/stockService";
import { validateProductData, validateVariations } from "@/backend/lib/utils/validators";
import Product from "@/backend/lib/models/Product";

export class CreateProductService {
  static async createProduct(body: ProductFormData) {
    // 1️⃣ Validaciones generales
    const validationError = validateProductData(body);
    if (validationError) throw new Error(validationError);

    if (!body.categoria) {
      throw new Error("La categoría es requerida");
    }

    if (body.tieneVariaciones) {
      const variationError = validateVariations(body.variaciones || []);
      if (variationError) throw new Error(variationError);
    } else {
      if (!body.precio || body.precio <= 0) throw new Error("Precio válido es requerido para productos sin variaciones");
      if (body.stock === undefined || body.stock < 0) throw new Error("Stock válido es requerido para productos sin variaciones");
    }

    // 2️⃣ Normalizar categoría
    const categoriaId = this.normalizeCategoria(body.categoria);

    // 3️⃣ Crear un _id para el producto antes de generar variaciones
    const productId = new Types.ObjectId();

    // 4️⃣ Preparar variaciones con productId
    let variationsWithProductId: any[] = [];
    if (body.tieneVariaciones && body.variaciones?.length) {
      variationsWithProductId = body.variaciones.map((v: any) => ({
        ...v,
        _id: new Types.ObjectId(),
        productId, // ✅ Asignamos productId desde el inicio
        precio: Number(v.precio) || 0,
        stock: Number(v.stock) || 0,
        stockMinimo: Number(v.stockMinimo) || 5,
      }));
    }

    // 5️⃣ Preparar datos del producto
    const productData: any = {
      _id: productId,
      ...body,
      categoria: categoriaId,
      stockMinimo: body.stockMinimo ?? 5,
      activo: body.activo !== false,
      destacado: body.destacado || false,
      variaciones: variationsWithProductId,
      precio: body.tieneVariaciones ? undefined : Number(body.precio) || 0,
      stock: body.tieneVariaciones ? undefined : Number(body.stock) || 0,
    };

    // 6️⃣ Crear producto en DB
    const product = await Product.create(productData);

    // 7️⃣ Crear movimientos de stock iniciales
    await this.createInitialStockMovements(product);

    // 8️⃣ Devolver producto
    return product.toObject();
  }

  private static normalizeCategoria(categoria: any): Types.ObjectId {
    if (typeof categoria === "string" && Types.ObjectId.isValid(categoria)) {
      return new Types.ObjectId(categoria);
    } else if (categoria?._id) {
      return new Types.ObjectId(categoria._id);
    } else if (categoria instanceof Types.ObjectId) {
      return categoria;
    } else {
      throw new Error("Formato de categoría no válido");
    }
  }

  private static async createInitialStockMovements(product: any) {
    if (product.tieneVariaciones && product.variaciones.length > 0) {
      for (const variation of product.variaciones) {
        await StockService.createMovement({
          productId: product._id.toString(),
          variationId: variation._id.toString(),
          type: "initial" as const,
          quantity: variation.stock || 0,
          previousStock: 0,
          newStock: variation.stock || 0,
          reason: "initial_stock",
          productName: product.nombre,
          productCode: product.codigoPrincipal,
          categoryName: product.categoria?.nombre || "",
          variationName: variation.nombre || "",
          variationCode: variation.codigo || "",
        });
      }
    } else {
      await StockService.createMovement({
        productId: product._id.toString(),
        type: "initial" as const,
        quantity: product.stock || 0,
        previousStock: 0,
        newStock: product.stock || 0,
        reason: "initial_stock",
        productName: product.nombre,
        productCode: product.codigoPrincipal,
        categoryName: product.categoria?.nombre || "",
      });
    }
  }
}
