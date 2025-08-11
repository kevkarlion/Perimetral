// src/app/api/categorias/route.ts
import { NextResponse } from 'next/server';
import { createCategoria, getAllCategorias, deleteCategoria } from '@/backend/lib/controllers/categoriaController';

// GET /api/categorias → lista todas las categorías
export async function GET() {
  return await getAllCategorias();
}

// POST /api/categorias → crea una categoría
export async function POST(request: Request) {
  return await createCategoria(request);
}

// DELETE /api/categorias → elimina una categoría por ID (en body)
export async function DELETE(request: Request) {
  return await deleteCategoria(request);
}