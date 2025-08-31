// backend/lib/controllers/stockController.ts
import { NextRequest, NextResponse } from 'next/server';
import { StockService } from '@/backend/lib/services/stockService';
import { getCurrentAdmin } from '@/backend/lib/auth/auth';
import { getCookiesFromRequest } from '@/backend/lib/utils/requestUtils';
import { StockMovementCreateData, StockMovementFilter } from '@/types/stockTypes';

export class StockController {
  static async createMovement(req: NextRequest) {
    try {
      // Obtener cookies de la request
      const cookies = getCookiesFromRequest(req);
      
      // Verificar autenticación usando tu sistema
      const admin = await getCurrentAdmin(cookies);
      if (!admin) {
        return NextResponse.json(
          { success: false, error: 'No autorizado' },
          { status: 401 }
        );
      }

      const body = await req.json();
      const movementData: StockMovementCreateData = {
        ...body,
        createdBy: admin._id.toString()
      };

      // Validaciones básicas
      if (!movementData.productId || !movementData.type || !movementData.quantity || !movementData.reason) {
        return NextResponse.json(
          { success: false, error: 'Datos incompletos' },
          { status: 400 }
        );
      }

      if (movementData.quantity <= 0) {
        return NextResponse.json(
          { success: false, error: 'La cantidad debe ser mayor a 0' },
          { status: 400 }
        );
      }

      const movement = await StockService.createMovement(movementData);

      return NextResponse.json({
        success: true,
        data: movement
      });
    } catch (error: any) {
      console.error('Error creating stock movement:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Error interno del servidor' 
        },
        { status: 500 }
      );
    }
  }


  
  static async getMovements(req: NextRequest) {
  console.log('Obtener movimientos desde getMovements')
  try {
    // Obtener cookies de la request
    const cookies = getCookiesFromRequest(req);
    
    // Verificar autenticación usando tu sistema
    const admin = await getCurrentAdmin(cookies);
    console.log('admin', admin)
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const filter: StockMovementFilter = {
      productId: searchParams.get('productId') || undefined,
      variationId: searchParams.get('variationId') || undefined,
      type: searchParams.get('type') as any || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20')
    };

    // Parsear fechas si están presentes
    if (searchParams.get('startDate')) {
      filter.startDate = new Date(searchParams.get('startDate')!);
    }
    if (searchParams.get('endDate')) {
      filter.endDate = new Date(searchParams.get('endDate')!);
    }

    const result = await StockService.getMovements(filter);
    
    // Transformar los datos para la respuesta
    const formattedMovements = result.movements.map((movement: any) => ({
      _id: movement._id,
      type: movement.type,
      quantity: movement.quantity,
      previousStock: movement.previousStock,
      newStock: movement.newStock,
      reason: movement.reason,
      createdAt: movement.createdAt,
      updatedAt: movement.updatedAt,
      
      // Información del producto
      product: movement.product ? {
        _id: movement.product._id,
        codigoPrincipal: movement.product.codigoPrincipal,
        nombre: movement.product.nombre,
        categoria: movement.product.categoria,
        medida: movement.product.medida,
        tieneVariaciones: movement.product.tieneVariaciones
      } : null,
      
      // Información completa de la variación
      variation: movement.variation ? {
        _id: movement.variation._id,
        codigo: movement.variation.codigo,
        medida: movement.variation.medida,
        precio: movement.variation.precio,
        stock: movement.variation.stock,
        stockMinimo: movement.variation.stockMinimo,
        atributos: movement.variation.atributos,
        imagenes: movement.variation.imagenes,
        activo: movement.variation.activo
      } : null,
      
      // Información del usuario si existe
      createdByUser: movement.createdByUser ? {
        _id: movement.createdByUser._id,
        email: movement.createdByUser.email,
        nombre: movement.createdByUser.nombre
      } : null
    }));

    console.log('Movimientos formateados:', formattedMovements);

    
    return NextResponse.json({
      success: true,
      data: formattedMovements,
      pagination: {
        page: result.page,
        limit: filter.limit!,
        total: result.total,
        pages: result.pages
      }
    });
    
  } catch (error: any) {
    console.error('Error getting stock movements:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

  static async getMovementById(req: NextRequest, id: string) {
    try {
      // Obtener cookies de la request
      const cookies = getCookiesFromRequest(req);
      
      // Verificar autenticación usando tu sistema
      const admin = await getCurrentAdmin(cookies);
      if (!admin) {
        return NextResponse.json(
          { success: false, error: 'No autorizado' },
          { status: 401 }
        );
      }

      const movement = await StockService.getMovementById(id);
      if (!movement) {
        return NextResponse.json(
          { success: false, error: 'Movimiento no encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: movement
      });
    } catch (error: any) {
      console.error('Error getting stock movement:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Error interno del servidor' 
        },
        { status: 500 }
      );
    }
  }

  static async getCurrentStock(req: NextRequest) {
    try {
      // Obtener cookies de la request
      const cookies = getCookiesFromRequest(req);
      
      // Verificar autenticación usando tu sistema
      const admin = await getCurrentAdmin(cookies);
      if (!admin) {
        return NextResponse.json(
          { success: false, error: 'No autorizado' },
          { status: 401 }
        );
      }

      const { searchParams } = new URL(req.url);
      const productId = searchParams.get('productId');
      const variationId = searchParams.get('variationId') || undefined;

      if (!productId) {
        return NextResponse.json(
          { success: false, error: 'productId es requerido' },
          { status: 400 }
        );
      }

      const stockLevel = await StockService.getCurrentStock(productId, variationId);

      return NextResponse.json({
        success: true,
        data: stockLevel
      });
    } catch (error: any) {
      console.error('Error getting current stock:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Error interno del servidor' 
        },
        { status: 500 }
      );
    }
  }

  static async getLowStockItems(req: NextRequest) {
    try {
      // Obtener cookies de la request
      const cookies = getCookiesFromRequest(req); 
      
      // Verificar autenticación usando tu sistema
      const admin = await getCurrentAdmin(cookies);
      console.log('Admin:', admin);
      if (!admin) {
        return NextResponse.json(
          { success: false, error: 'No autorizado' },
          { status: 401 }
        );
      }

      const { searchParams } = new URL(req.url);
      const threshold = parseInt(searchParams.get('threshold') || '5');

      const lowStockItems = await StockService.getLowStockItems(threshold);

      return NextResponse.json({
        success: true,
        data: lowStockItems,
        count: lowStockItems.length
      });
    } catch (error: any) {
      console.error('Error getting low stock items:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Error interno del servidor' 
        },
        { status: 500 }
      );
    }
  }

  static async getStockHistory(req: NextRequest) {
    try {
      // Obtener cookies de la request
      const cookies = getCookiesFromRequest(req);
      
      // Verificar autenticación usando tu sistema
      const admin = await getCurrentAdmin(cookies);
      if (!admin) {
        return NextResponse.json(
          { success: false, error: 'No autorizado' },
          { status: 401 }
        );
      }

      const { searchParams } = new URL(req.url);
      const productId = searchParams.get('productId');
      const variationId = searchParams.get('variationId') || undefined;
      const days = parseInt(searchParams.get('days') || '30');

      if (!productId) {
        return NextResponse.json(
          { success: false, error: 'productId es requerido' },
          { status: 400 }
        );
      }

      const history = await StockService.getStockHistory(productId, variationId, days);

      return NextResponse.json({
        success: true,
        data: history
      });
    } catch (error: any) {
      console.error('Error getting stock history:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error.message || 'Error interno del servidor' 
        },
        { status: 500 }
      );
    }
  }
}