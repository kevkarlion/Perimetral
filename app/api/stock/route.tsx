import { NextRequest, NextResponse } from "next/server";
import { IVariation } from "@/types/cart";

import {
  getAllProducts,
  createProduct,
  deleteProductById,
  updateProduct,
} from "@/lib/controllers/productControllers";

// GET - Obtener todos los productos
export async function GET() {
  console.log("GET /api/stock - Fetching all products");
  return getAllProducts();
}

// POST - Crear nuevo producto
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("POST /api/stock - Body recibido:", body);
    return await createProduct(body); // <<-- Asegúrate de usar await
  } catch (error) {
    console.error("Error al parsear JSON:", error);
    return new Response(JSON.stringify({ error: "Cuerpo de solicitud inválido" }), {
      status: 400
    });
  }
}
// DELETE - Eliminar producto por ID (?id=)
export async function DELETE(req: NextRequest) {
  return deleteProductById(req);
}





export async function PUT(req: NextRequest) {
  try {
    console.log('PUT /api/stock - Inicio');
    const body = await req.json();
    console.log('Body recibido:', JSON.stringify(body, null, 2));

    const { productId, action, variation } = body;
    
    if (!productId || !action) {
      console.error('Faltan parámetros requeridos');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Faltan parámetros requeridos (productId o action)" 
        }),
        { status: 400 }
      );
    }

    console.log('Pasando al controlador...');
    const response = await updateProduct(
      new NextRequest(req.url, {
        body: JSON.stringify(body),
        method: "PUT",
        headers: req.headers
      })
    );

    console.log('Respuesta del controlador:', response);
    return response;
    
  } catch (error) {
    console.error("Error completo en PUT /api/stock:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: "Error al procesar la solicitud",
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    );
  }
}