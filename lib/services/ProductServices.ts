import Product, { IProduct } from '../models/Product';
import { IVariation } from '../types/productTypes';


// Conversa directamente con la base de datos.

// Aplica reglas de negocio (ej: calcular descuentos).

export class ProductService {
  // Crear producto
  static async createProduct(productData: Omit<IProduct, '_id'>): Promise<IProduct> {
    return await Product.create(productData);
  }

  // Obtener todos los productos
  static async getProducts(): Promise<IProduct[]> {
    return await Product.find();
  }

  // Obtener producto por ID
  static async getProductById(id: string): Promise<IProduct | null> {
    return await Product.findById(id);
  }

  // Actualizar variaciones de precio
  static async updateVariations(productId: string, variations: IVariation[]): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(
      productId,
      { $set: { variaciones: variations } },
      { new: true }
    );
  }
}