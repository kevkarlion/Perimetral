// File: backend/lib/controllers/variationController.ts
import { variationService } from "@/backend/lib/services/variationService";
import { NextResponse } from "next/server";
import VariationModel from "@/backend/lib/models/VariationModel";


export const variationController = {
  async create(req: Request) {
    try {
      const body = await req.json();
      console.log("REQUEST BODY:", body);
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
        { status: 400 },
      );
    }
  },

  async getByProduct(productId: string) {
    try {
      console.log("PRODUCT ID:", productId);
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
        { status: 400 },
      );
    }
  },

  async getById(id: string) {
    try {
      const data = await variationService.getById(id);

      return NextResponse.json({
        success: true,
        data,
      });
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          error: err.message || "Error al obtener la variación",
        },
        { status: err.message === "Variación no encontrada" ? 404 : 500 }
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
        { status: 400 },
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
        { status: 400 },
      );
    }
  },
};
