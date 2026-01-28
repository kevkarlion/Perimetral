//api/variations/route.tsx
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import { variationController } from "@/backend/lib/controllers/variationController";
import { NextRequest } from "next/server";

export async function POST(req: Request) {
  await dbConnect();
  return variationController.create(req);
}

export async function GET(req: NextRequest) {
  await dbConnect();

  const productId = req.nextUrl.searchParams.get("productId");
  
  if (!productId) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "productId es obligatorio",
      }),
      { status: 400 },
    );
  }

  return variationController.getByProduct(productId);
}
