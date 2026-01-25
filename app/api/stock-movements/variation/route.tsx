// app/api/stock-movements/variation/route.ts
import { StockMovementController } from "@/backend/lib/controllers/stockController";
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";

await dbConnect();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return StockMovementController.getByVariation(id);
}

