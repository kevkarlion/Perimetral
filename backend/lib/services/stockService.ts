// backend/lib/services/stockService.ts
import StockMovement, { IStockMovement } from '@/backend/lib/models/StockMovement';
import Product from '@/backend/lib/models/Product';
import { dbConnect } from '@/backend/lib/dbConnect/dbConnect';
import { 
  StockMovementCreateData, 
  StockMovementFilter,
  StockLevel ,
  IStockMovementDocument
} from '@/types/stockTypes';
import { Types } from 'mongoose';
 
export class StockService {
  static async createMovement(movementData: StockMovementCreateData): Promise<IStockMovement> {
    await dbConnect();

    // Obtener stock actual del producto/variación
    const product = await Product.findById(movementData.productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    let previousStock = 0;
    let newStock = 0;

    if (movementData.variationId) {
      // Manejar variación
      const variation = product.variaciones.id(movementData.variationId);
      if (!variation) {
        throw new Error('Variación no encontrada');
      }

      previousStock = variation.stock;
      
      // Calcular nuevo stock según el tipo de movimiento
      switch (movementData.type) {
        case 'in':
          newStock = previousStock + movementData.quantity;
          break;
        case 'out':
          newStock = Math.max(0, previousStock - movementData.quantity);
          break;
        case 'adjustment':
          newStock = movementData.quantity;
          break;
        default:
          newStock = previousStock;
      }

      // Actualizar stock de la variación
      variation.stock = newStock;
    } else {
      // Manejar producto sin variaciones
      if (!product.tieneVariaciones) {
        previousStock = product.stock || 0;
        
        switch (movementData.type) {
          case 'in':
            newStock = previousStock + movementData.quantity;
            break;
          case 'out':
            newStock = Math.max(0, previousStock - movementData.quantity);
            break;
          case 'adjustment':
            newStock = movementData.quantity;
            break;
          default:
            newStock = previousStock;
        }

        product.stock = newStock;
      } else {
        throw new Error('El producto tiene variaciones, especifique una variación');
      }
    }

    // Crear el movimiento de stock
    const movement = new StockMovement({
      ...movementData,
      previousStock,
      newStock,
      productId: movementData.productId,
      variationId: movementData.variationId
    });

    // Guardar ambos en una transacción
    const session = await StockMovement.startSession();
    session.startTransaction();

    try {
      await movement.save({ session });
      await product.save({ session });
      await session.commitTransaction();
      session.endSession();

      return movement;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

static async getMovements(filter: StockMovementFilter = {}): Promise<{
  movements: IStockMovementDocument[];
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
    limit = 20
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
        .populate('productId', 'nombre codigoPrincipal')
        .populate('createdBy', 'email nombre')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      StockMovement.countDocuments(query)
    ]);

    return {
      movements,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }

  static async getMovementById(id: string): Promise<IStockMovement | null> {
    await dbConnect();
    return StockMovement.findById(id)
      .populate('productId', 'nombre codigoPrincipal')
      .populate('createdBy', 'email nombre')
      .exec();
  }

  static async getCurrentStock(productId: string, variationId?: string): Promise<StockLevel> {
    await dbConnect();

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (variationId) {
      const variation = product.variaciones.id(variationId);
      if (!variation) {
        throw new Error('Variación no encontrada');
      }

      // Obtener último movimiento para esta variación
      const lastMovement = await StockMovement.findOne({
        productId,
        variationId
      }).sort({ createdAt: -1 });

      return {
        productId,
        variationId,
        currentStock: variation.stock,
        minimumStock: variation.stockMinimo || 0,
        lastMovement: lastMovement?.createdAt
      };
    } else {
      if (product.tieneVariaciones) {
        throw new Error('El producto tiene variaciones, especifique una variación');
      }

      // Obtener último movimiento para este producto
      const lastMovement = await StockMovement.findOne({
        productId,
        variationId: { $exists: false }
      }).sort({ createdAt: -1 });

      return {
        productId,
        currentStock: product.stock || 0,
        minimumStock: product.stockMinimo || 0,
        lastMovement: lastMovement?.createdAt
      };
    }
  }

  static async getLowStockItems(threshold?: number): Promise<StockLevel[]> {
    await dbConnect();

    const lowStockItems: StockLevel[] = [];

    // Productos sin variaciones
    const products = await Product.find({
      tieneVariaciones: false,
      activo: true,
      $or: [
        { stock: { $lte: threshold || 5 } },
        { stock: { $lte: '$stockMinimo' } }
      ]
    });

    for (const product of products) {
      lowStockItems.push({
        productId: product._id,
        currentStock: product.stock || 0,
        minimumStock: product.stockMinimo || 0
      });
    }

    // Productos con variaciones
    const productsWithVariations = await Product.find({
      tieneVariaciones: true,
      activo: true,
      'variaciones.activo': true
    });

    for (const product of productsWithVariations) {
      for (const variation of product.variaciones) {
        if (variation.activo && 
            (variation.stock <= (threshold || 5) || 
             variation.stock <= (variation.stockMinimo || 0))) {
          lowStockItems.push({
            productId: product._id,
            variationId: variation._id,
            currentStock: variation.stock,
            minimumStock: variation.stockMinimo || 0
          });
        }
      }
    }

    return lowStockItems;
  }

  static async getStockHistory(productId: string, variationId?: string, days: number = 30) {
    await dbConnect();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const query: any = {
      productId,
      createdAt: { $gte: startDate }
    };

    if (variationId) {
      query.variationId = variationId;
    } else {
      query.variationId = { $exists: false };
    }

    return StockMovement.find(query)
      .populate('createdBy', 'email nombre')
      .sort({ createdAt: 1 })
      .exec();
  }
}