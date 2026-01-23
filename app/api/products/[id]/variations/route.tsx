import { NextRequest } from "next/server";
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import { variationController } from "@/backend/lib/controllers/variationController";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id } = await params; // 👈 CRÍTICO

  console.log("PRODUCT ID:", id);

  return variationController.getByProduct(id);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id } = await params;
  const body = await req.json();

  return variationController.create(
    new Request("", {
      body: JSON.stringify({
        ...body,
        product: id,
      }),
    })
  );
}
