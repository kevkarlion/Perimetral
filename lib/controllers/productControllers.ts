import { NextResponse } from 'next/server';
import { ProductService } from '../services/ProductServices';
import { IProduct, IProductUpdate } from '../models/Product';

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

  // GET /api/products/:id
  static async getProductById(request: Request, { params }: { params: { id: string } }) {
    try {
      const product = await ProductService.getProductById(params.id);
      if (!product) {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }
      return NextResponse.json(product);
    } catch (error) {
      return NextResponse.json(
        { error: 'Error al obtener el producto' },
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

  // PATCH /api/products/:id
  static async updateProductStock(request: Request, { params }: { params: { id: string } }) {
    try {
      const updateData: IProductUpdate = await request.json();
      const updatedProduct = await ProductService.updateProductStock(params.id, updateData);
      
      if (!updatedProduct) {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(updatedProduct);
    } catch (error) {
      return NextResponse.json(
        { error: 'Error al actualizar producto' },
        { status: 500 }
      );
    }
  }

  // DELETE /api/products/:id
  static async deleteProduct(request: Request, { params }: { params: { id: string } }) {
    try {
      const deletedProduct = await ProductService.deleteProduct(params.id);
      
      if (!deletedProduct) {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      return NextResponse.json(
        { error: 'Error al eliminar producto' },
        { status: 500 }
      );
    }
  }
}