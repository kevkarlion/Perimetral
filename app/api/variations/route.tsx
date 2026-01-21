import { variationController } from "@/backend/lib/controllers/variationController";
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";

export async function POST(req: Request) {
  await dbConnect();
  return variationController.create(req);
}
