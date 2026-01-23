import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import { categoriaController } from "@/backend/lib/controllers/categoriaController";

/**
 * GET /api/categories/:id
 * Traer una categoría por id
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  return categoriaController.getById(params.id);
}

/**
 * PATCH /api/categories/:id
 * Editar categoría por id
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  return categoriaController.update(req, params.id);
}

/**
 * DELETE /api/categories/:id
 * Eliminar categoría por id
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  return categoriaController.delete(params.id);
}


export async function POST(req: Request) {
  await dbConnect();
  return categoriaController.create(req);
}

