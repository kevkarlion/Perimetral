import { ProductController } from '@/lib/controllers/productControllers';

// GET /api/products
export const GET = ProductController.getAllProducts;

// POST /api/products
export const POST = ProductController.createProduct;