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

    console.log("datos recibidos a servicio ", movementData);

    // Convertir string IDs to ObjectId
    const productId = new Types.ObjectId(movementData.productId);
    const variationId = movementData.variationId
      ? new Types.ObjectId(movementData.variationId)
      : undefined;
    const createdBy = movementData.createdBy
      ? new Types.ObjectId(movementData.createdBy)
      : undefined;

    // Obtener stock actual del producto/variación
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    // ✅ VALIDACIONES MEJORADAS
    if (product.tieneVariaciones && !movementData.variationId) {
      throw new Error(
        "El producto tiene variaciones, especifique una variación"
      );
    }

    if (!product.tieneVariaciones && movementData.variationId) {
      throw new Error(
        "El producto no tiene variaciones, no se debe especificar variación"
      );
    }

    let previousStock = 0;
    let newStock = 0;

    if (movementData.variationId) {
      // Manejar variación
      const variation = product.variaciones.id(movementData.variationId);
      if (!variation) {
        throw new Error("Variación no encontrada");
      }

      previousStock = variation.stock;

      // Calcular nuevo stock según el tipo de movimiento
      switch (movementData.type) {
        case "in":
          newStock = previousStock + movementData.quantity;
          break;
        case "out":
          newStock = Math.max(0, previousStock - movementData.quantity);
          break;
        case "adjustment":
          newStock = movementData.quantity;
          break;
        default:
          newStock = previousStock;
      }

      // Actualizar stock de la variación
      variation.stock = newStock;
    } else {
      // Manejar producto sin variaciones
      previousStock = product.stock || 0;

      switch (movementData.type) {
        case "in":
          newStock = previousStock + movementData.quantity;
          break;
        case "out":
          newStock = Math.max(0, previousStock - movementData.quantity);
          break;
        case "adjustment":
          newStock = movementData.quantity;
          break;
        default:
          newStock = previousStock;
      }

      product.stock = newStock;
    }

    // Crear el movimiento de stock
    const movement = new StockMovement({
      ...movementData,
      productId,
      variationId,
      createdBy,
      previousStock,
      newStock,
    });

    // Guardar ambos en una transacción
    const session = await StockMovement.startSession();
    session.startTransaction();

    try {
      await movement.save({ session });
      await product.save({ session });
      await session.commitTransaction();
      session.endSession();

      // Populate después de guardar para devolver datos completos
      return await StockMovement.findById(movement._id)
        .populate("productId", "nombre codigoPrincipal")
        .populate("createdBy", "email nombre")
        .exec();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
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
      startDate,
      endDate,
      page = 1,
      limit = 20,
    } = filter;

    const query: any = {};

    // Convertir string IDs to ObjectId para las búsquedas
    if (productId) query.productId = new Types.ObjectId(productId);
    if (variationId) query.variationId = new Types.ObjectId(variationId);
    if (type) query.type = type;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    const skip = (page - 1) * limit;

    const [movements, total] = await Promise.all([
      StockMovement.find(query)
        .populate("productId", "nombre codigoPrincipal")
        .populate("createdBy", "email nombre")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() // Usar lean() para mejor performance
        .exec(),
      StockMovement.countDocuments(query),
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
  static async getLowStockItems(threshold?: number): Promise<StockLevel[]> {
    await dbConnect();

    const lowStockItems: StockLevel[] = [];
    const stockThreshold = threshold ?? 5; // valor por defecto si no viene

    // Productos sin variaciones
    const products = await Product.find({
      tieneVariaciones: false,
      activo: true,
      $expr: { $lte: ["$stock", stockThreshold] }, // usamos $expr para comparar con variable JS
    });

    for (const product of products) {
      lowStockItems.push({
        productId: product._id,
        currentStock: product.stock || 0,
        minimumStock: product.stockMinimo || stockThreshold,
      });
    }

    // Productos con variaciones
    const productsWithVariations = await Product.find({
      tieneVariaciones: true,
      activo: true,
      "variaciones.activo": true,
    });

    for (const product of productsWithVariations) {
      for (const variation of product.variaciones) {
        if (
          variation.activo &&
          (variation.stock <= stockThreshold ||
            variation.stock <= (variation.stockMinimo ?? stockThreshold))
        ) {
          lowStockItems.push({
            productId: product._id,
            variationId: variation._id,
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
  }): Promise<any> {
    try {
      const { productId, variationId, stock, action = "set" } = body;

      console.log("Datos para actualizar stock:", {
        productId,
        variationId,
        stock,
        action,
      });

      // Validaciones básicas
      if (!productId) {
        throw new Error("ID de producto requerido");
      }

      if (stock === undefined || stock === null) {
        throw new Error("Valor de stock requerido");
      }

      const numericStock = Number(stock);
      if (isNaN(numericStock) || numericStock < 0) {
        throw new Error("Stock debe ser un número válido mayor o igual a 0");
      }

      // Obtener el producto para verificar si tiene variaciones
      await dbConnect();
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Producto no encontrado");
      }

      let movementData: any = {
        productId,
        type: "adjustment" as const,
        quantity: numericStock,
        reason: "manual_adjustment",
      };

      // Determinar el tipo de movimiento basado en la acción
      if (action === "increment") {
        movementData.type = "in";
        movementData.reason = "manual_increment";
      } else if (action === "decrement") {
        movementData.type = "out";
        movementData.reason = "manual_decrement";
      }

      // Si es una variación, agregar el variationId
      if (variationId) {
        // Verificar que la variación existe
        const variation = product.variaciones.id(variationId);
        if (!variation) {
          throw new Error("Variación no encontrada");
        }
        movementData.variationId = variationId;
      } else if (product.tieneVariaciones) {
        throw new Error(
          "El producto tiene variaciones, especifique una variación"
        );
      }

      // Crear el movimiento de stock
      return await StockService.createMovement(movementData);
    } catch (error) {
      console.error("Error en updateStock:", error);
      throw error;
    }
  }
}
