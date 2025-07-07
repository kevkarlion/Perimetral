import { NextRequest } from "next/server";

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
  console.log("PUT /api/stock - Actualizando producto o variación");
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');
    const { action, variation, variationId } = await req.json();
    console.log("Datos recibidos a route:", { productId, action, variation, variationId });
    
    if (!productId) {
      return new Response(
        JSON.stringify({ error: "Se requiere productId" }),
        { status: 400 }
      );
    }

    if (action === "add-variation") {
      if (!variation?.medida) {
        return new Response(
          JSON.stringify({ error: "La variación debe incluir medida" }),
          { status: 400 }
        );
      }
      
      return await updateProduct(
        new NextRequest(req.url, {
          body: JSON.stringify({
            productId,
            action: "add-variation",
            variation: {
              ...variation,
              codigo: variation.codigo || `${productId}-${variation.medida.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
            }
          }),
          method: "PUT",
          headers: req.headers
        })
      );
    }

    if (action === "remove-variation") {
      if (!variationId) {
        return new Response(
          JSON.stringify({ error: "Se requiere variationId" }),
          { status: 400 }
        );
      }

      return await updateProduct(
        new NextRequest(req.url, {
          body: JSON.stringify({
            productId,
            action: "remove-variation",
            variationId
          }),
          method: "PUT",
          headers: req.headers
        })
      );
    }

    return updateProduct(req);

  } catch (error) {
    console.error("Error en PUT /api/stock:", error);
    return new Response(
      JSON.stringify({ 
        error: "Error al procesar la solicitud",
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500 }
    );
  }
}