import { variationController } from "@/backend/lib/controllers/variationController";
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  return variationController.getByProduct(params.id);
}


export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  return variationController.update(req, params.id);
}
