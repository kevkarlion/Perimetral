// backend/lib/services/stockService.ts
import StockMovement from "@/backend/lib/models/StockMovement"; // Sin import de interfaz
import Product from "@/backend/lib/models/Product";
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import {
  StockMovementCreateData,
  StockMovementFilter,
  StockLevel,
} from "@/types/stockTypes";
import { Types } from "mongoose";

export class StockService {
  static async createMovement(
    movementData: StockMovementCreateData
  ): Promise<any> {
    await dbConnect();

    console.log("Creating movement with data:", movementData);

    const productId = new Types.ObjectId(movementData.productId);
    const createdBy = movementData.createdBy
      ? new Types.ObjectId(movementData.createdBy)
      : undefined;

    // Obtener producto
    const product = await Product.findById(productId);
    if (!product) throw new Error("Producto no encontrado");

    // Manejar variación si existe
    let variationId: Types.ObjectId | undefined;
    let variation: any = null;

    if (movementData.variationId) {
      variationId = new Types.ObjectId(movementData.variationId);
      variation = product.variaciones.find(
        (v: any) => v._id && v._id.toString() === movementData.variationId
      );
      if (!variation) throw new Error("Variación no encontrada");
    } else if (product.tieneVariaciones) {
      throw new Error(
        "VariationId es requerido para productos con variaciones"
      );
    }

    // ✅ Usar los valores proporcionados directamente
    const previousStock = movementData.previousStock;
    const newStock = movementData.newStock;

    // ✅ Crear el movimiento con la información completa
    const movement = new StockMovement({
      ...movementData,
      productId,
      variationId,
      createdBy,
      previousStock,
      newStock,
      productName: movementData.productName || product.nombre,
      productCode: movementData.productCode || product.codigoPrincipal,
      categoryName:
        movementData.categoryName ||
        (product.categoria && typeof product.categoria === "object"
          ? product.categoria.nombre
          : ""),
      variationName: movementData.variationName || variation?.nombre || "",
      variationCode: movementData.variationCode || variation?.codigo || "",
    });

    const session = await StockMovement.startSession();
    session.startTransaction();

    try {
      await movement.save({ session });

      // ✅ Actualizar el stock en el producto/variación
      if (variation) {
        variation.stock = newStock;
      } else {
        product.stock = newStock;
      }

      await product.save({ session });

      await session.commitTransaction();
      session.endSession();

      return await StockMovement.findById(movement._id)
        .populate("productId", "nombre codigoPrincipal")
        .populate("createdBy", "email nombre")
        .exec();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("Error saving stock movement:", error);
      throw error;
    }
  }

  static async getMovements(filter: StockMovementFilter = {}): Promise<{
    movements: any[];
    total: number;
    page: number;
    pages: number;
  }> {
    await dbConnect();

    const {
      productId,
      variationId,
      type,
      productName,
      categoryName,
      variationName,
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = filter;

    const matchStage: any = {};

    // Filtros por IDs
    if (productId) matchStage.productId = new Types.ObjectId(productId);
    if (variationId) matchStage.variationId = new Types.ObjectId(variationId);
    if (type) matchStage.type = type;

    // Filtros por nombres (búsqueda case-insensitive)
    if (productName)
      matchStage.productName = { $regex: productName, $options: "i" };
    if (categoryName)
      matchStage.categoryName = { $regex: categoryName, $options: "i" };
    if (variationName)
      matchStage.variationName = { $regex: variationName, $options: "i" };

    // Filtros por fecha
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = new Date(startDate);
      if (endDate) matchStage.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    // Pipeline MUY SIMPLIFICADO - solo filtros y paginación
    const pipeline: any[] = [
      { $match: matchStage },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const [movements, total] = await Promise.all([
      StockMovement.aggregate(pipeline).exec(),
      StockMovement.countDocuments(matchStage),
    ]);

    return {
      movements,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  static async getMovementById(id: string): Promise<any> {
    await dbConnect();
    return StockMovement.findById(id)
      .populate("productId", "nombre codigoPrincipal")
      .populate("createdBy", "email nombre")
      .lean()
      .exec();
  }

  static async getMovementsByVariationId(variationId: string): Promise<any[]> {
    await dbConnect();
    return StockMovement.find({ variationId: new Types.ObjectId(variationId) })
      .populate("productId", "nombre codigoPrincipal")
      .populate("createdBy", "email nombre")
      .populate("variationId") // incluye datos completos de la variación
      .sort({ createdAt: 1 }) // opcional: ordena cronológicamente
      .lean()
      .exec();
  }

  static async getCurrentStock(
    productId: string,
    variationId?: string
  ): Promise<StockLevel> {
    await dbConnect();

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    if (variationId) {
      const variation = product.variaciones.id(variationId);
      if (!variation) {
        throw new Error("Variación no encontrada");
      }

      // Obtener último movimiento para esta variación
      const lastMovement = await StockMovement.findOne({
        productId,
        variationId,
      }).sort({ createdAt: -1 });

      return {
        productId,
        variationId,
        currentStock: variation.stock,
        minimumStock: variation.stockMinimo || 0,
        lastMovement: lastMovement?.createdAt,
      };
    } else {
      if (product.tieneVariaciones) {
        throw new Error(
          "El producto tiene variaciones, especifique una variación"
        );
      }

      // Obtener último movimiento para este producto
      const lastMovement = await StockMovement.findOne({
        productId,
        variationId: { $exists: false },
      }).sort({ createdAt: -1 });

      return {
        productId,
        currentStock: product.stock || 0,
        minimumStock: product.stockMinimo || 0,
        lastMovement: lastMovement?.createdAt,
      };
    }
  }

  // Obtener productos con bajo stock
  // En tu StockService.ts
  // En tu StockService.ts
  static async getLowStockItems(threshold?: number): Promise<any[]> {
    await dbConnect();

    const lowStockItems: any[] = [];
    const stockThreshold = threshold ?? 5;

    // Productos sin variaciones
    const products = await Product.find({
      tieneVariaciones: false,
      activo: true,
      $expr: { $lte: ["$stock", stockThreshold] },
    }).select("nombre codigoPrincipal stock stockMinimo precio medida"); // Añadir precio y medida

    for (const product of products) {
      lowStockItems.push({
        productId: product._id,
        product: {
          _id: product._id,
          nombre: product.nombre,
          codigoPrincipal: product.codigoPrincipal,
          precio: product.precio,
          medida: product.medida,
        },
        // Para productos sin variación, creamos un objeto variation con datos del producto
        variation: {
          _id: product._id, // Usamos el ID del producto como ID de variación
          codigo: product.codigoPrincipal,
          medida: product.medida,
          precio: product.precio,
          stock: product.stock,
          stockMinimo: product.stockMinimo,
        },
        currentStock: product.stock || 0,
        minimumStock: product.stockMinimo || stockThreshold,
      });
    }

    // Productos con variaciones
    const productsWithVariations = await Product.find({
      tieneVariaciones: true,
      activo: true,
      "variaciones.activo": true,
    }).select("nombre codigoPrincipal variaciones");

    for (const product of productsWithVariations) {
      for (const variation of product.variaciones) {
        if (
          variation.activo &&
          (variation.stock <= stockThreshold ||
            variation.stock <= (variation.stockMinimo ?? stockThreshold))
        ) {
          lowStockItems.push({
            productId: product._id,
            product: {
              _id: product._id,
              nombre: product.nombre,
              codigoPrincipal: product.codigoPrincipal,
            },
            variationId: variation._id,
            variation: {
              _id: variation._id,
              codigo: variation.codigo,
              medida: variation.medida,
              precio: variation.precio,
              stock: variation.stock,
              stockMinimo: variation.stockMinimo,
            },
            currentStock: variation.stock,
            minimumStock: variation.stockMinimo ?? stockThreshold,
          });
        }
      }
    }

    return lowStockItems;
  }

  static async getStockHistory(
    productId: string,
    variationId?: string,
    days: number = 30
  ) {
    await dbConnect();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const query: any = {
      productId,
      createdAt: { $gte: startDate },
    };

    if (variationId) {
      query.variationId = variationId;
    } else {
      query.variationId = { $exists: false };
    }

    return StockMovement.find(query)
      .populate("createdBy", "email nombre")
      .sort({ createdAt: 1 })
      .exec();
  }

  static async updateStock(body: {
    productId: string;
    variationId?: string;
    stock: number;
    action?: "set" | "increment" | "decrement";
    productName?: string;
    productCode?: string;
    categoryName?: string;
    variationName?: string;
    variationCode?: string;
    currentStock?: number;
  }): Promise<any> {
    try {
      const {
        productId,
        variationId,
        stock,
        action = "set",
        productName,
        productCode,
        categoryName,
        variationName,
        variationCode,
        currentStock,
      } = body;

      await dbConnect();

      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      let targetStock: number;
      let previousStock: number;

      // ✅ Manejar productos con y sin variaciones
      if (variationId) {
        const variation = product.variaciones.id(variationId);
        if (!variation) {
          throw new Error("Variación no encontrada");
        }

        previousStock =
          currentStock !== undefined ? currentStock : variation.stock;

        // ✅ Calcular nuevo stock según la acción
        if (action === "set") {
          targetStock = Number(stock);
        } else if (action === "increment") {
          targetStock = previousStock + Number(stock);
        } else if (action === "decrement") {
          targetStock = Math.max(0, previousStock - Number(stock));
        } else {
          throw new Error("Acción no válida");
        }

        // ✅ Actualizar el stock
        variation.stock = targetStock;
      } else {
        // ✅ Producto sin variaciones
        if (product.tieneVariaciones) {
          throw new Error(
            "El producto tiene variaciones, debe especificar variationId"
          );
        }

        previousStock =
          currentStock !== undefined ? currentStock : product.stock || 0;

        if (action === "set") {
          targetStock = Number(stock);
        } else if (action === "increment") {
          targetStock = previousStock + Number(stock);
        } else if (action === "decrement") {
          targetStock = Math.max(0, previousStock - Number(stock));
        } else {
          throw new Error("Acción no válida");
        }

        product.stock = targetStock;
      }

      await product.save();

      // ✅ Registrar el movimiento con información completa
      const movementData: StockMovementCreateData = {
        productId,
        variationId,
        type:
          action === "increment"
            ? "in"
            : action === "decrement"
            ? "out"
            : "adjustment",
        quantity: Math.abs(Number(stock)),
        reason:
          action === "increment"
            ? "manual_increment"
            : action === "decrement"
            ? "manual_decrement"
            : "manual_adjustment",
        previousStock: previousStock, // ✅ Stock anterior
        newStock: targetStock, // ✅ Stock nuevo
        productName: productName || product.nombre,
        productCode: productCode || product.codigoPrincipal,
        categoryName:
          categoryName ||
          (product.categoria && typeof product.categoria === "object"
            ? product.categoria.nombre
            : ""),
        variationName:
          variationName ||
          (variationId ? product.variaciones.id(variationId)?.nombre : ""),
        variationCode:
          variationCode ||
          (variationId ? product.variaciones.id(variationId)?.codigo : ""),
      };

      const movement = await StockService.createMovement(movementData);

      return {
        success: true,
        previousStock,
        newStock: targetStock,
        movement,
      };
    } catch (error) {
      console.error("Error en updateStock:", error);
      throw error;
    }
  }
}
