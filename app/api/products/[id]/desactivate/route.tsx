import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import { productController } from "@/backend/lib/controllers/productControllers";


export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  return productController.deactivate(params.id);
}
