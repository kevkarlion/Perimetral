// src/services/categoriaService.ts
import Categoria from '@/backend/lib/models/Categoria';
import { dbConnect } from '@/backend/lib/dbConnect/dbConnect';
import { Types } from 'mongoose';
import Product from '@/backend/lib/models/Product';

export class CategoriaService {
  static async getAllCategories() {
    await dbConnect();
    return await Categoria.find().sort({ nombre: 1 }).lean();
  }

  static async findOrCreate(nombre: string) {
    await dbConnect();
    
    const slug = this.generateSlug(nombre);
    
    // Buscar por nombre o slug (insensitive)
    const existing = await Categoria.findOne({
      $or: [
        { nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } },
        { slug: { $regex: new RegExp(`^${slug}$`, 'i') } }
      ]
    });
    
    return await Categoria.create({ nombre, slug });
  }

  static async deleteCategory(id: string) {
    await dbConnect();
    
    // Verificar si hay productos asociados
    const productosAsociados = await Product.countDocuments({ categoria: id });
    if (productosAsociados > 0) {
      throw new Error('No se puede eliminar: existen productos asociados a esta categoría');
    }

    return await Categoria.findByIdAndDelete(id);
  }

  static async categoryExists(id: Types.ObjectId) {
    await dbConnect();
    return await Categoria.exists({ _id: id });
  }

  private static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }
}