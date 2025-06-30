// lib/services/productService.ts
import Product from '@/lib/models/Product';
import { dbConnect } from '@/lib/dbConnect/dbConnect';
import { isValidObjectId } from 'mongoose';

const productService = {
  async getAllProducts() {
    await dbConnect();
    return Product.find().lean();
  },

  async createProduct(data: any) {
    await dbConnect();
    // Asegura que el producto tenga un ID único
    const productData = {
      ...data,
      id: data.id || require('uuid').v4() // Genera UUID si no existe
    };
    return Product.create(productData);
  },

  async deleteProduct(id: string) {
    await dbConnect();
    // Busca por ID de MongoDB o por tu campo 'id' (UUID)
    if (isValidObjectId(id)) {
      return Product.findByIdAndDelete(id);
    }
    return Product.findOneAndDelete({ id });
  },





 async updateProduct(id: string, updateData: any) {
  await dbConnect();
  
  // Asegúrate de que las variaciones tengan el formato correcto
  if (updateData.variaciones) {
    updateData.variaciones = updateData.variaciones.map((v: any) => ({
      ...v,
      // Convierte precio a número si es necesario
      precio: typeof v.precio === 'string' ? 
        Number(v.precio.replace(/[^0-9.-]+/g,"")) : 
        v.precio
    }));
  }

  return Product.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true }
  );
},


  

  // Método adicional para buscar por cualquier tipo de ID
  async getProductById(id: string) {
    await dbConnect();
    if (isValidObjectId(id)) {
      return Product.findById(id).lean();
    }
    return Product.findOne({ id }).lean();
  }
};

export default productService;