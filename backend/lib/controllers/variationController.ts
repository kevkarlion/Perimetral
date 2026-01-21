import { variationService } from "@/backend/lib/services/variationService";
import { NextResponse } from "next/server";

export const variationController = {
  async create(req: Request) {
    try {
      const body = await req.json();
      const variation = await variationService.create(body);

      return NextResponse.json({
        success: true,
        data: variation,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al crear la variación",
          details: error.message,
        },
        { status: 400 }
      );
    }
  },

  async getByProduct(productId: string) {
    try {
      const variations = await variationService.getByProduct(productId);

      return NextResponse.json({
        success: true,
        data: variations,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al obtener variaciones",
          details: error.message,
        },
        { status: 400 }
      );
    }
  },


  async update(req: Request, id: string) {
    try {
      const body = await req.json();
      const variation = await variationService.update(id, body);

      return NextResponse.json({
        success: true,
        data: variation,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al actualizar la variación",
          details: error.message,
        },
        { status: 400 }
      );
    }
  },

  async deactivate(id: string) {
    try {
      const variation = await variationService.deactivate(id);

      return NextResponse.json({
        success: true,
        data: variation,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          success: false,
          error: "Error al desactivar la variación",
          details: error.message,
        },
        { status: 400 }
      );
    }
  },
};



