import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";

import { variationController } from "@/backend/lib/controllers/variationController";

export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  return variationController.deactivate(params.id);
}
