//api/stock/route.ts
import { NextRequest, NextResponse } from "next/server";


import {
  getAllProducts,
  createProduct,
  deleteProductById,
  updateProduct,
  updateStock
} from "@/backend/lib/controllers/productControllers";



// GET - Obtener todos los productos
export async function GET() {
  try {
   
    const response = await getAllProducts();
    console.log("Productos obtenidos:", response);
    
    // Devuelve directamente la respuesta del controlador
    console.log("GET /api/stock - Respuesta:", response);
    return response;
  } catch (error) {
    console.error("Error en GET /api/stock:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Error al obtener productos",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
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
    const body = await req.json();
    console.log('Body recibido:', JSON.stringify(body, null, 2));

    const { productId, action, variation, stock, variationId } = body;
    
    if (!productId) {
      console.error('Faltan parámetros requeridos');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Faltan parámetros requeridos (productId)" 
        }),
        { status: 400 }
      );
    }

    // Lógica existente para manejo de variaciones
    if (variation || action === 'update-variation') {
      console.log('Ejecutando actualización de variación...');
      const response = await updateProduct(
        new NextRequest(req.url, {
          body: JSON.stringify(body),
          method: "PUT",
          headers: req.headers
        })
      );
      return response;
    }
    // Nueva lógica para manejo de stock (usando las mismas variables)
    else if (stock !== undefined) {
      console.log('Ejecutando actualización de stock...');
      
      const updateData = {
        productId,
        stock: Number(stock),
        variationId: variationId || null,
        action: action || 'set' // Por defecto 'set' si no se especifica
      };

      const response = await updateStock(
        new NextRequest(req.url, {
          body: JSON.stringify(updateData),
          method: "PUT",
          headers: req.headers
        })
      );
      return response;
    }
    else {
      console.error('Acción no reconocida');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: "Acción no reconocida. Proporcione 'variation' o 'stock' en el body" 
        }),
        { status: 400 }
      );
    }
    
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

