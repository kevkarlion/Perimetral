// app/api/categories/route.ts
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import { categoriaController } from "@/backend/lib/controllers/categoriaController";

export async function POST(req: Request) {
  await dbConnect();
  return categoriaController.create(req);
}

export async function GET() {
  await dbConnect();
  return categoriaController.getAll();
}
