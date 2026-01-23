// app/api/categories/route.ts
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import { categoriaController } from "@/backend/lib/controllers/categoriaController";



//esto se debe eliminar porque lo maneja el route de id
export async function POST(req: Request) {
  await dbConnect();
  return categoriaController.create(req);
}

export async function GET() {
  await dbConnect();
  return categoriaController.getAll();
}


