import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.product.delete({
      where: {
        id: params.id
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    );
  }
}
import { NextRequest } from 'next/server';
import { StockController } from '@/lib/controllers/stock.controller';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return StockController.getById(req, { params });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return StockController.update(req, { params });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return StockController.delete(req, { params });
}
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { stock } = await req.json();
  
  try {
    const updatedProduct = await db.product.update({
      where: {
        id: params.id
      },
      data: {
        stock
      }
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar stock' },
      { status: 500 }
    );
  }
}