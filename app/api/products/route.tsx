//api/products/route.tsx
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import { productController } from "@/backend/lib/controllers/productControllers";

export async function POST(req: Request) {
  await dbConnect();
  return productController.create(req);
}

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");

  if (categoryId) {
    // si viene categoryId, filtramos por categoría
    return productController.getByCategory(categoryId);
  }

  // si no viene categoryId, devolvemos todos los productos
  return productController.getAll();
}