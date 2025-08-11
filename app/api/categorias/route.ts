// src/app/api/categorias/route.ts
import { NextResponse } from 'next/server';
import { createCategoria } from '@/backend/lib/controllers/categoriaController';

export async function POST(request: Request) {
  return await createCategoria(request);
}