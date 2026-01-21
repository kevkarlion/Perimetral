import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import { productController } from "@/backend/lib/controllers/productControllers";

export async function POST(req: Request) {
  await dbConnect();
  return productController.create(req);
}

export async function GET() {
  await dbConnect();
  return productController.getAll();
}
