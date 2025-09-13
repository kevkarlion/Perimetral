// backend/lib/controllers/stockController.ts
import { Types } from "mongoose";
import StockMovement from "@/backend/lib/models/StockMovement";
import { NextRequest, NextResponse } from "next/server";
import { StockService } from "@/backend/lib/services/stockService";
import { getCurrentAdmin } from "@/backend/lib/auth/auth";
import { getCookiesFromRequest } from "@/backend/lib/utils/requestUtils";
import {
  StockMovementCreateData,
  StockMovementFilter,
} from "@/types/stockTypes";

export class StockController {
  static async createMovement(req: NextRequest) {
    try {
      // Obtener cookies de la request
      const cookies = getCookiesFromRequest(req);

      // Verificar autenticación usando tu sistema
      const admin = await getCurrentAdmin(cookies);
      if (!admin) {
        return NextResponse.json(
          { success: false, error: "No autorizado" },
          { status: 401 }
        );
      }

      const body = await req.json();
      console.log("Admin creating movement:", body);

      const movementData: StockMovementCreateData = {
        ...body,
        createdBy: admin._id.toString(),
      };
      console.log("movementData", movementData);
      
      // Validaciones básicas
      if (
        !movementData.productId ||
        !movementData.type ||
        !movementData.quantity ||
        !movementData.reason
      ) {
        return NextResponse.json(
          { success: false, error: "Datos incompletos" },
          { status: 400 }
        );
      }

      if (movementData.quantity <= 0) {
        return NextResponse.json(
          { success: false, error: "La cantidad debe ser mayor a 0" },
          { status: 400 }
        );
      }

      const movement = await StockService.createMovement(movementData);

      return NextResponse.json({
        success: true,
        data: movement,
      });
    } catch (error: any) {
      console.error("Error creating stock movement:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Error interno del servidor",
        },
        { status: 500 }
      );
    }
  }

  // backend/lib/controllers/stockController.ts
static async getMovements(filter: StockMovementFilter, req: NextRequest) {
  try {
    // Obtener cookies de la request desde el NextRequest
    const cookies = getCookiesFromRequest(req);

    // Verificar autenticación usando tu sistema
    const admin = await getCurrentAdmin(cookies);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    console.log("Admin autorizado, obteniendo movimientos con filter:", filter);

    // Usar el servicio para obtener los movimientos
    const result = await StockService.getMovements(filter);

    // Transformar los datos para la respuesta
    const formattedMovements = result.movements.map((movement: any) => ({
      _id: movement._id,
      productId: movement.productId,
      variationId: movement.variationId,
      type: movement.type,
      quantity: movement.quantity,
      previousStock: movement.previousStock,
      newStock: movement.newStock,
      reason: movement.reason,
      notes: movement.notes,
      reference: movement.reference,
      createdAt: movement.createdAt,
      updatedAt: movement.updatedAt,
      productName: movement.productName,
      productCode: movement.productCode,
      categoryName: movement.categoryName,
      variationName: movement.variationName,
      variationCode: movement.variationCode,

      // MANTENER COMPATIBILIDAD
      productInfo: {
        _id: movement.productId,
        nombre: movement.productName,
        codigoPrincipal: movement.productCode,
        categoria: movement.categoryName,
      },
      variationInfo: movement.variationId ? {
        _id: movement.variationId,
        nombre: movement.variationName,
        codigo: movement.variationCode,
      } : null,
      product: {
        _id: movement.productId,
        codigoPrincipal: movement.productCode,
        nombre: movement.productName,
        categoria: movement.categoryName,
        medida: "",
        tieneVariaciones: true,
      },
      variation: movement.variationId ? {
        _id: movement.variationId,
        codigo: movement.variationCode,
        medida: "",
        precio: 0,
        stock: movement.newStock,
        stockMinimo: 0,
        atributos: [],
        imagenes: [],
        activo: true,
      } : null,
    }));

    console.log("Movimientos formateados:", formattedMovements.length, "encontrados");

    return NextResponse.json({
      success: true,
      data: formattedMovements,
      pagination: {
        page: result.page,
        limit: filter.limit!,
        total: result.total,
        pages: result.pages,
      },
    });
  } catch (error: any) {
    console.error("Error getting stock movements:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}




  static async getMovementsByVariationId(req: NextRequest) {
    try {
      // Obtener cookies de la request
      const cookies = getCookiesFromRequest(req);

      // Verificar autenticación usando tu sistema
      const admin = await getCurrentAdmin(cookies);
      if (!admin) {
        return NextResponse.json(
          { success: false, error: "No autorizado" },
          { status: 401 }
        );
      }

      const { searchParams } = new URL(req.url);
      const variationId = searchParams.get("variationId");
      
      if (!variationId) {
        return NextResponse.json(
          { success: false, error: "variationId es requerido" },
          { status: 400 }
        );
      }

      const movements = await StockService.getMovementsByVariationId(variationId);

      if (!movements || movements.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "No se encontraron movimientos para esta variación",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: movements,
      });
    } catch (error: any) {
      console.error("Error getting stock movements:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Error interno del servidor",
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
          { success: false, error: "No autorizado" },
          { status: 401 }
        );
      }

      const { searchParams } = new URL(req.url);
      const productId = searchParams.get("productId");
      const variationId = searchParams.get("variationId") || undefined;

      if (!productId) {
        return NextResponse.json(
          { success: false, error: "productId es requerido" },
          { status: 400 }
        );
      }

      const stockLevel = await StockService.getCurrentStock(productId, variationId);

      return NextResponse.json({
        success: true,
        data: stockLevel,
      });
    } catch (error: any) {
      console.error("Error getting current stock:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Error interno del servidor",
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
      console.log("Admin:", admin);
      if (!admin) {
        return NextResponse.json(
          { success: false, error: "No autorizado" },
          { status: 401 }
        );
      }

      const { searchParams } = new URL(req.url);
      const threshold = parseInt(searchParams.get("threshold") || "5");

      const lowStockItems = await StockService.getLowStockItems(threshold);

      return NextResponse.json({
        success: true,
        data: lowStockItems,
        count: lowStockItems.length,
      });
    } catch (error: any) {
      console.error("Error getting low stock items:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Error interno del servidor",
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
          { success: false, error: "No autorizado" },
          { status: 401 }
        );
      }

      const { searchParams } = new URL(req.url);
      const productId = searchParams.get("productId");
      const variationId = searchParams.get("variationId") || undefined;
      const days = parseInt(searchParams.get("days") || "30");

      if (!productId) {
        return NextResponse.json(
          { success: false, error: "productId es requerido" },
          { status: 400 }
        );
      }

      const history = await StockService.getStockHistory(productId, variationId, days);

      return NextResponse.json({
        success: true,
        data: history,
      });
    } catch (error: any) {
      console.error("Error getting stock history:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message || "Error interno del servidor",
        },
        { status: 500 }
      );
    }
  }
}