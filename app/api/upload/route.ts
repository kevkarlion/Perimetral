import { NextRequest } from 'next/server';
import { imageController } from '@/backend/lib/controllers/imageController';

export async function POST(request: NextRequest) {
  return imageController.uploadImage(request);
}

export async function DELETE(request: NextRequest) {
  return imageController.deleteImage(request);
}