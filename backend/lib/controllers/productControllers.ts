import { productService } from "@/backend/lib/services/productService";
import { NextResponse } from "next/server";

export const productController = {
  async create(req: Request) {
    try {
      const body = await req.json();
      const product = await productService.create(body);

      return NextResponse.json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al crear el producto",
          details: error.message,
        },
        { status: 400 }
      );
    }
  },

  async getAll() {
    try {
      const products = await productService.getAll();

      return NextResponse.json({
        success: true,
        data: products,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al obtener productos",
          details: error.message,
        },
        { status: 500 }
      );
    }
  },

  async getById(id: string) {
    try {
      const product = await productService.getById(id);

      return NextResponse.json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Producto no encontrado",
          details: error.message,
        },
        { status: 404 }
      );
    }
  },

async update(req: Request, id: string) {
  try {
    const body = await req.json();
    const product = await productService.update(id, body);

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error al actualizar el producto",
        details: error.message,
      },
      { status: 400 }
    );
  }
},

async deactivate(id: string) {
  try {
    const product = await productService.deactivate(id);

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Error al desactivar el producto",
        details: error.message,
      },
      { status: 400 }
    );
  }
},


};
