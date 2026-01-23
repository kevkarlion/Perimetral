//variations/[id]/route.tsx
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import { variationController } from "@/backend/lib/controllers/variationController";

type Params = {
  params: Promise<{ id: string }>;
};
export async function GET(_: Request, { params }: Params) {
  await dbConnect();
  const { id } = await params; // 👈 CLAVE
  return variationController.getById(id);
}

export async function PATCH(req: Request, { params }: Params) {
  await dbConnect();
  const { id } = await params; // 👈 CLAVE
  return variationController.update(req, id);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await dbConnect();
  const { id } = await params; // 👈 desestructuramos luego de await
  return variationController.deactivate(id);
}
