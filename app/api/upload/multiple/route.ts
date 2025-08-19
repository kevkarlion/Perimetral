import { NextRequest } from 'next/server';
import { imageController } from '@/backend/lib/controllers/imageController';

export async function POST(request: NextRequest) {
  return imageController.uploadMultipleImages(request);
}