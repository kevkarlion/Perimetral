// backend/lib/controllers/categoriaController.ts
import { categoriaService } from "@/backend/lib/services/categoriaService";
import { NextResponse } from "next/server";

export const categoriaController = {
  async create(req: Request) {
    try {
      const body = await req.json();
      const categoria = await categoriaService.create(body);

      return NextResponse.json({
        success: true,
        data: categoria,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al crear la categoría",
          details: error.message,
        },
        { status: 400 }
      );
    }
  },

  async getAll() {
    try {
      const categorias = await categoriaService.getAll();

      return NextResponse.json({
        success: true,
        data: categorias,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al obtener categorías",
          details: error.message,
        },
        { status: 500 }
      );
    }
  },


  async delete(id: string) {
    try {
      await categoriaService.delete(id);

      return NextResponse.json({
        success: true,
        message: "Categoría eliminada correctamente",
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al eliminar la categoría",
          details: error.message,
        },
        { status: 400 }
      );
    }
  },

  async getById(id: string) {
    try {
      const categoria = await categoriaService.getById(id);

      return NextResponse.json({
        success: true,
        data: categoria,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al obtener la categoría",
          details: error.message,
        },
        { status: 404 }
      );
    }
  },

  async update(req: Request, id: string) {
  try {
    const body = await req.json()
    const updatedCategoria = await categoriaService.update(id, body)

    return NextResponse.json({
      success: true,
      data: updatedCategoria,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error al actualizar la categoría",
        details: error.message,
      },
      { status: 400 }
    )
  }
}

};
