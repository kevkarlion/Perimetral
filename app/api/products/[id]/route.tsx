import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";

import { productController } from "@/backend/lib/controllers/productControllers";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  return productController.update(req, params.id);
}
