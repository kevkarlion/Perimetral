import  { Product, IProduct, IProductUpdate } from '@/lib/models/Product';
import { IVariation } from '../types/productTypes';

export class ProductService {
  // Obtener todos los productos
  static async getProducts(): Promise<IProduct[]> {
    return await Product.find().lean();
  }

  // Obtener producto por ID
  static async getProductById(id: string): Promise<IProduct | null> {
    return await Product.findById(id).lean();
  }

  // Crear nuevo producto
  static async createProduct(productData: Omit<IProduct, '_id'>): Promise<IProduct> {
    return await Product.create(productData);
  }

  // Actualizar stock de producto
  static async updateProductStock(id: string, updateData: IProductUpdate): Promise<IProduct | null> {
    const update: any = {};
    
    if (updateData.stock !== undefined) {
      update.stock = updateData.stock;
    }
    
    if (updateData.salesCount !== undefined) {
      update.salesCount = updateData.salesCount;
    }
    
    if (updateData.variaciones !== undefined) {
      update.variaciones = updateData.variaciones;
    }

    return await Product.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    ).lean();
  }

  // Eliminar producto
  static async deleteProduct(id: string): Promise<IProduct | null> {
    return await Product.findByIdAndDelete(id).lean();
  }

  // Actualizar variaciones de precio
  static async updateVariations(productId: string, variations: IVariation[]): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(
      productId,
      { $set: { variaciones: variations } },
      { new: true }
    ).lean();
  }
}