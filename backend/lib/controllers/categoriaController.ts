// src/controllers/categoriaController.ts
import { NextResponse } from 'next/server';
import { CategoriaService } from '@/backend/lib/services/categoriaService';
import { ICategoria, CategoriaDTO } from '@/types/categoria';
import { Types } from 'mongoose';

type ApiResponse<T> = NextResponse<{ 
  success: boolean; 
  data?: T; 
  error?: string; 
  details?: any 
}>;

export async function getAllCategorias(): Promise<ApiResponse<CategoriaDTO[]>> {
  try {
    const categorias = await CategoriaService.getAllCategories();
    return NextResponse.json({ 
      success: true, 
      data: categorias.map(cat => ({
        _id: cat._id!.toString(),
        nombre: cat.nombre,
        slug: cat.slug,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al obtener categorías',
        details: error instanceof Error ? error.message : null
      },
      { status: 500 }
    );
  }
}


export async function createCategoria(request: Request): Promise<ApiResponse<CategoriaDTO>>
 {
  try {
    const { nombre } = await request.json();

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 2) {
      return NextResponse.json(
        { 
          success: false,
          error: 'El nombre debe tener al menos 2 caracteres' 
        },
        { status: 400 }
      );
    }

  const categoria = await CategoriaService.findOrCreate(nombre.trim());
  return NextResponse.json({
    success: true,
    data: {
      _id: categoria._id!.toString(),
      nombre: categoria.nombre,
      slug: categoria.slug,
      createdAt: categoria.createdAt,
      updatedAt: categoria.updatedAt
    }
  }, { status: 201 });

  } catch (error) {
    if (error instanceof Error && error.message.includes('ya existe')) {
      return NextResponse.json(
        { 
          success: false,
          error: error.message 
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al crear categoría',
        details: error instanceof Error ? error.message : null
      },
      { status: 500 }
    );
  }
}

export async function deleteCategoria(request: Request): Promise<ApiResponse<{ deleted: boolean }>> {
  try {
    const { id } = await request.json();

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'ID de categoría no válido' 
        },
        { status: 400 }
      );
    }

    const result = await CategoriaService.deleteCategory(id);
    
    if (!result) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Categoría no encontrada' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      data: { deleted: true }
    });

  } catch (error) {
    if (error instanceof Error && error.message.includes('productos asociados')) {
      return NextResponse.json(
        { 
          success: false,
          error: error.message 
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al eliminar categoría',
        details: error instanceof Error ? error.message : null
      },
      { status: 500 }
    );
  }
}