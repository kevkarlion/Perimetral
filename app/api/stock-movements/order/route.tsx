// app/api/stock-movements/variation/route.ts
import { StockMovementController } from "@/backend/lib/controllers/stockController";
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";

await dbConnect();
export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  return StockMovementController.getByOrder(token);
}
