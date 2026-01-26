// /api/products/route.tsx
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import { productController } from "@/backend/lib/controllers/productControllers";

export async function GET(req: Request) {
  await dbConnect();
  return productController.get(req);
}


export async function POST(req: Request) {
  await dbConnect();
  return productController.create(req);
} 
