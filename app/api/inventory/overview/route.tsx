// app/api/inventory/overview/route.ts
import { InventoryController } from "@/backend/lib/controllers/inventoryController";
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";

await dbConnect();


export async function GET() {
  return InventoryController.overview();
}
