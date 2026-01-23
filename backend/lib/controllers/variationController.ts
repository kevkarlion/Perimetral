// File: backend/lib/controllers/variationController.ts
import { variationService } from "@/backend/lib/services/variationService";
import { NextResponse } from "next/server";
import VariationModel from "@/backend/lib/models/VariationModel";
import { IVariationBase } from "@/types/variationsTypes";


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
        { status: 400 }
      );
    }
  },

 async getById(id: string) {
const variation = await VariationModel.findById(id).lean<IVariationBase>();
  if (!variation) {
    return new Response(
      JSON.stringify({ success: false, error: "No se encontró la variación" }),
      { status: 404 }
    );
  }
  // 👇 Asegurarse que productId esté incluido
  return new Response(
    JSON.stringify({
      success: true,
      data: {
        _id: variation._id,
        productId: variation.product, // obligatorio para cartStore
        nombre: variation.nombre,
        precio: variation.precio,
        imagenes: variation.imagenes,
        stock: variation.stock,
        medida: variation.medida,
        uMedida: variation.uMedida,
        atributos: variation.atributos,
      },
    }),
    { status: 200 }
  );
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



