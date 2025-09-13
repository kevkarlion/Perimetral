//api/stock/route.ts
import { NextRequest, NextResponse } from "next/server";
import { StockService } from "@/backend/lib/services/stockService";

import {
  getAllProducts,
  createProduct,
  deleteProductById,
  updateProduct,
  updateStock,
  updatePrice
} from "@/backend/lib/controllers/productControllers";



// GET - Obtener todos los productos
export async function GET() {
  try {
    return await getAllProducts();
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Error en GET /api/stock",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo producto
export async function POST(req: Request) {
  try {
    const body = req.body ? await req.json() : {};
    console.log("POST /api/stock - Body recibido:", body);
    return await createProduct(body); // <<-- Asegúrate de usar await
  } catch (error) {
    console.error("Error al parsear JSON:", error);
    return new Response(
      JSON.stringify({ error: "Cuerpo de solicitud inválido" }),
      {
        status: 400,
      }
    );
  }
}

// DELETE - Eliminar producto por ID (?id=)
export async function DELETE(req: NextRequest) {
  return deleteProductById(req);
}


// PUT - Actualizar producto
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Body recibido:", JSON.stringify(body, null, 2));

    const { productId, action, variation, stock, variationId, price, productName, productCode, categoryName, variationName, variationCode } = body;

    if (!productId) {
      console.error("Faltan parámetros requeridos");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Faltan parámetros requeridos (productId)",
        }),
        { status: 400 }
      );
    }

    // 1. Actualización de precios (prioridad más alta)
    if (price !== undefined) {
      console.log("Ejecutando actualización de precio...");
      // ... código existente
    }

    // 2. AGREGAR variación
    if (action === "add-variation") {
      console.log("Ejecutando agregado de variación...");
      const response = await updateProduct(
        new NextRequest(req.url, {
          body: JSON.stringify({
            productId,
            action: "add-variation",
            variation,
          }),
          method: "PUT",
          headers: req.headers,
        })
      );
      return response;
    }

    // 3. ELIMINAR variación
    if (action === "remove-variation") {
      console.log("Ejecutando eliminación de variación...");
      const response = await updateProduct(
        new NextRequest(req.url, {
          body: JSON.stringify({
            productId,
            action: "remove-variation",
            variationId,
          }),
          method: "PUT",
          headers: req.headers,
        })
      );
      return response;
    }

    // 4. ACTUALIZAR variación
    if (action === "update-variation") {
      console.log("Ejecutando actualización de variación...");
      const response = await updateProduct(
        new NextRequest(req.url, {
          body: JSON.stringify(body),
          method: "PUT",
          headers: req.headers,
        })
      );
      return response;
    }

    // 5. Manejo de stock - ✅ MANEJO DE INCREMENT/DECREMENT
    if (stock !== undefined) {
      console.log("Ejecutando actualización de stock...");

      const updateData = {
        productId,
        stock: Number(stock),
        variationId: variationId || null,
        action: action || "set",
        // ✅ NUEVOS CAMPOS para información rápida
        productName: productName || undefined,
        productCode: productCode || undefined,
        categoryName: categoryName || undefined,
        variationName: variationName || undefined,
        variationCode: variationCode || undefined,
      };

      // ✅ LLAMADA CORRECTA al método estático de StockService
      try {
        const movement = await StockService.updateStock(updateData);
        
        return new Response(
          JSON.stringify({
            success: true,
            data: movement,
            message: 'Stock actualizado correctamente'
          }),
          { status: 200 }
        );
        
      } catch (error) {
        console.error('Error al actualizar stock:', error);
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Error al actualizar stock',
            details: error instanceof Error ? error.message : String(error)
          }),
          { status: 500 }
        );
      }
    }

    // 6. Si llega aquí, es una acción no reconocida
    console.error("Acción no reconocida:", action);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Acción no reconocida. Acciones válidas: 'add-variation', 'update-variation', 'remove-variation', o proporcione 'stock'/'price'",
      }),
      { status: 400 }
    );

  } catch (error) {
    console.error("Error completo en PUT /api/stock:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Error al procesar la solicitud",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
}