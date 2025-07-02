// lib/services/productService.ts
import Product from "@/lib/models/Product";
import { dbConnect } from "@/lib/dbConnect/dbConnect";
import { Types } from "mongoose";
import { IProduct, IVariation } from "@/lib/types/productTypes";

type ProductDocument = ReturnType<typeof Product.prototype.toObject>;
type ProductCreateData = Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>;
type ProductUpdateData = Partial<ProductCreateData>;

// Función para transformar documentos Mongoose a IProduct
const toIProduct = (doc: ProductDocument): IProduct => {
  return {
    _id: doc._id.toString(),
    codigoPrincipal: doc.codigoPrincipal,
    nombre: doc.nombre,
    categoria: doc.categoria,
    descripcionCorta: doc.descripcionCorta,
    descripcionLarga: doc.descripcionLarga || '',
    precio: doc.precio,
    stock: doc.stock,
    stockMinimo: doc.stockMinimo ?? 5,
    tieneVariaciones: doc.tieneVariaciones ?? false,
    variaciones: (doc.variaciones || []).map(v => ({
      _id: v._id?.toString(),
      codigo: v.codigo,
      descripcion: v.descripcion || '',
      medida: v.medida,
      precio: v.precio,
      stock: v.stock,
      stockMinimo: v.stockMinimo ?? 5,
      atributos: v.atributos ? {
        longitud: v.atributos.longitud,
        altura: v.atributos.altura,
        calibre: v.atributos.calibre || '',
        material: v.atributos.material || '',
        color: v.atributos.color || ''
      } : undefined,
      imagenes: v.imagenes || [],
      activo: v.activo !== false
    })),
    especificacionesTecnicas: doc.especificacionesTecnicas || [],
    caracteristicas: doc.caracteristicas || [],
    imagenesGenerales: doc.imagenesGenerales || [],
    proveedor: doc.proveedor || '',
    destacado: doc.destacado ?? false,
    activo: doc.activo !== false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt
  };
};

const productService = {
  async getAllProducts(): Promise<IProduct[]> {
    await dbConnect();
    const products = await Product.find({}).lean();
    return products.map(toIProduct);
  },

  async createProduct(data: ProductCreateData): Promise<IProduct> {
    console.log('Creando producto desde servicio...');
    await dbConnect();
    const product = new Product(data);
    await product.save();
    return toIProduct(product.toObject());
  },

  async deleteProduct(id: string): Promise<boolean> {
    await dbConnect();
    if (!Types.ObjectId.isValid(id)) throw new Error('ID inválido');
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  },

  async updateProduct(id: string, updateData: ProductUpdateData): Promise<IProduct> {
    await dbConnect();
    if (!Types.ObjectId.isValid(id)) throw new Error('ID inválido');
    
    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) throw new Error('Producto no encontrado');
    return toIProduct(updated);
  },

  async getProductById(id: string): Promise<IProduct | null> {
    await dbConnect();
    if (!Types.ObjectId.isValid(id)) throw new Error('ID inválido');
    const product = await Product.findById(id).lean();
    return product ? toIProduct(product) : null;
  },

  async updateProductVariations(id: string, variations: IVariation[]): Promise<IProduct> {
    await dbConnect();
    if (!Types.ObjectId.isValid(id)) throw new Error('ID inválido');
    
    const updated = await Product.findByIdAndUpdate(
      id,
      { variaciones: variations },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) throw new Error('Producto no encontrado');
    return toIProduct(updated);
  }
};

export default productService;