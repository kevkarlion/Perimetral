import { NextResponse } from 'next/server';
import { ProductService } from '../services/ProductServices';
import { IProduct } from '../models/Product';

// Recibe la petición.

// Valida que todo esté en orden.

// Delega el trabajo al servicio.


export class ProductController {
  // GET /api/products
  static async getAllProducts() {
    try {
      const products = await ProductService.getProducts();
      return NextResponse.json(products);
    } catch (error) {
      return NextResponse.json(
        { error: 'Error al obtener productos' },
        { status: 500 }
      );
    }
  }

  // POST /api/products
  static async createProduct(request: Request) {
    try {
      const productData: Omit<IProduct, '_id'> = await request.json();
      const newProduct = await ProductService.createProduct(productData);
      return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        { error: 'Error al crear producto' },
        { status: 400 }
      );
    }
  }
}