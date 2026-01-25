// app/api/stock-movements/route.ts
import { StockMovementController } from "@/backend/lib/controllers/stockController";
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";

await dbConnect();

export async function GET() {
  return StockMovementController.getAll();
}

export const dynamic = "force-dynamic";
