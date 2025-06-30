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
  return createProduct(req);
}

// DELETE - Eliminar producto por ID (?id=)
export async function DELETE(req: NextRequest) {
  return deleteProductById(req);
}

export async function PUT(req: NextRequest) {
  return updateProduct(req);
}