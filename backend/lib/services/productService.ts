// lib/services/productService.ts
import Product from "@/backend/lib/models/Product";
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import { Types } from "mongoose";
import { IProduct, IVariation, ServiceResponse } from "@/types/productTypes";

type ProductDocument = ReturnType<typeof Product.prototype.toObject>;
type ProductCreateData = Omit<IProduct, "_id" | "createdAt" | "updatedAt">;
type ProductUpdateData = Partial<ProductCreateData>;

// Función para transformar documentos Mongoose a IProduct
const toIProduct = (doc: ProductDocument): IProduct => {
  return {
    _id: doc._id.toString(),
    codigoPrincipal: doc.codigoPrincipal,
    nombre: doc.nombre,
    categoria: doc.categoria,
    descripcionCorta: doc.descripcionCorta,
    descripcionLarga: doc.descripcionLarga || "",
    precio: doc.precio,
    stock: doc.stock,
    stockMinimo: doc.stockMinimo ?? 5,
    tieneVariaciones: doc.tieneVariaciones ?? false,
    variaciones: (doc.variaciones || []).map((v: any) => ({
      _id: v._id?.toString(),
      codigo: v.codigo,
      descripcion: v.descripcion || "",
      medida: v.medida,
      precio: v.precio,
      stock: v.stock,
      stockMinimo: v.stockMinimo ?? 5,
      atributos: v.atributos
        ? {
            longitud: v.atributos.longitud,
            altura: v.atributos.altura,
            calibre: v.atributos.calibre || "",
            material: v.atributos.material || "",
            color: v.atributos.color || "",
          }
        : undefined,
      imagenes: v.imagenes || [],
      activo: v.activo !== false,
    })),
    especificacionesTecnicas: doc.especificacionesTecnicas || [],
    caracteristicas: doc.caracteristicas || [],
    imagenesGenerales: doc.imagenesGenerales || [],
    proveedor: doc.proveedor || "",
    destacado: doc.destacado ?? false,
    activo: doc.activo !== false,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

const productService = {
   async getAllProducts(): Promise<ServiceResponse<IProduct[]>> {
    try {
      console.log('estoy en servicio')
      await dbConnect();
      const products = await Product.find({}).lean();
      console.log('productos desde servicio', products)
      return {
        success: true,
        data: products.map(toIProduct)
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener productos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  },


  async getProductById(id: string): Promise<IProduct | null> {
  try {
    await dbConnect()
    if (!Types.ObjectId.isValid(id)) throw new Error("ID inválido")
    
    const product = await Product.findById(id).lean()
    return product ? toIProduct(product) : null
  } catch (error) {
    console.error('Error en getProductById:', error)
    throw error
  }
},


  async createProduct(data: ProductCreateData): Promise<IProduct> {
    console.log("Creando producto desde servicio...");
    await dbConnect();
    const product = new Product(data);
    await product.save();
    console.log("Producto creado en servicio:", product);
    return toIProduct(product.toObject());
  },





  async deleteProduct(id: string): Promise<boolean> {
    await dbConnect();
    if (!Types.ObjectId.isValid(id)) throw new Error("ID inválido");
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  },

  async updateProduct(
    id: string,
    updateData: ProductUpdateData
  ): Promise<IProduct> {
    await dbConnect();
    if (!Types.ObjectId.isValid(id)) throw new Error("ID inválido");

    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) throw new Error("Producto no encontrado");
    return toIProduct(updated);
  },





async addProductVariation(
  productId: string,
  variation: Omit<IVariation, "_id">
): Promise<{ success: boolean; product?: IProduct; variations?: IVariation[]; error?: string }> {
  try {
    console.log("Agregando variación al producto desde servicio...");
    await dbConnect();

    if (!Types.ObjectId.isValid(productId)) {
      return {
        success: false,
        error: "ID de producto no válido"
      };
    }

    const updated = await Product.findByIdAndUpdate(
      productId,
      {
        $push: {
          variaciones: {
            ...variation,
            stock: variation.stock || 0,
            stockMinimo: variation.stockMinimo ?? 5,
            activo: variation.activo !== false,
            atributos: variation.atributos || {
              longitud: 0,
              altura: 0,
              calibre: "",
              material: "",
              color: "",
            },
            imagenes: variation.imagenes || [],
          },
        },
        $set: { tieneVariaciones: true },
      },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return {
        success: false,
        error: "Producto no encontrado"
      };
    }

    const product = toIProduct(updated);
    console.log("Variación agregada correctamente:", product);

    return {
      success: true,
      product,
      variations: product.variaciones // Asegúrate de que toIProduct mantiene las variaciones
    };
  } catch (error) {
    console.error("Error en addProductVariation:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al agregar variación"
    };
  }
},

  /**
   * Elimina UNA variación específica
   * @param productId - ID del producto
   * @param variationId - ID o código de la variación
   */



  async removeProductVariation(
    productId: string,
    variationId: string
  ): Promise<IProduct> {
    await dbConnect();

    if (!Types.ObjectId.isValid(productId)) {
      throw new Error("ID de producto no válido");
    }

    const product = await Product.findById(productId);
    if (!product) throw new Error("Producto no encontrado");

    // Filtramos buscando por _id o codigo (como en tu modal)
    const initialLength = product.variaciones.length;
    product.variaciones = product.variaciones.filter(
      (v: any) => v._id?.toString() !== variationId && v.codigo !== variationId
    );

    if (product.variaciones.length === initialLength) {
      throw new Error("Variación no encontrada");
    }

    // Actualiza el flag si no quedan variaciones
    product.tieneVariaciones = product.variaciones.length > 0;

    const updated = await product.save();
    return toIProduct(updated.toObject());
  },

  // Añade estos métodos al servicio existente

async updateProductStock(
  productId: string,
  newStock: number,
  variationId?: string
): Promise<IProduct> {
  await dbConnect();
  
  if (!Types.ObjectId.isValid(productId)) {
    throw new Error('ID de producto no válido');
  }

  const updateQuery = variationId
    ? {
        $set: {
          'variaciones.$[elem].stock': newStock,
          updatedAt: new Date()
        }
      }
    : {
        $set: {
          stock: newStock,
          updatedAt: new Date()
        }
      };

  const options = variationId
    ? {
        new: true,
        arrayFilters: [{ 'elem._id': new Types.ObjectId(variationId) }]
      }
    : { new: true };

  const updated = await Product.findByIdAndUpdate(
    productId,
    updateQuery,
    options
  ).lean();

  if (!updated) throw new Error('Producto no encontrado');
  return toIProduct(updated);
},

async incrementProductStock(
  productId: string,
  amount: number,
  variationId?: string
): Promise<IProduct> {
  await dbConnect();
  console.log("Datos recibidos en incrementProductStock:", {
  productId,
  amount,  // Debería ser negativo (ej: -2)
  variationId
});
  
  if (!Types.ObjectId.isValid(productId)) {
    throw new Error('ID de producto no válido');
  }

  const incrementQuery = variationId
    ? {
        $inc: {
          'variaciones.$[elem].stock': amount
        },
        $set: {
          updatedAt: new Date()
        }
      }
    : {
        $inc: {
          stock: amount
        },
        $set: {
          updatedAt: new Date()
        }
      };

  const options = variationId
    ? {
        new: true,
        arrayFilters: [{ 'elem._id': new Types.ObjectId(variationId) }]
      }
    : { new: true };

  const updated = await Product.findByIdAndUpdate(
    productId,
    incrementQuery,
    options
  ).lean();

  if (!updated) throw new Error('Producto no encontrado');
  return toIProduct(updated);
}



};

export default productService;
