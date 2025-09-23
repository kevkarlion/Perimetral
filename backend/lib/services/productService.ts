// lib/services/productService.ts
import Product from "@/backend/lib/models/Product";
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import { Types, Require_id, FlattenMaps } from "mongoose";
import {
  IProduct,
  IVariation,
  ServiceResponse,
  IProductLean,
  IProductDocument,
} from "@/types/productTypes";
import { CategoriaService } from "@/backend/lib/services/categoriaService";

type ProductDocument = ReturnType<typeof Product.prototype.toObject>;
type ProductCreateData = Omit<IProduct, "_id" | "createdAt" | "updatedAt">;
type ProductUpdateData = Partial<ProductCreateData>;

type ProductInput =
  | ProductDocument
  | FlattenMaps<ProductDocument>
  | Require_id<FlattenMaps<ProductDocument>>;

const toIProduct = (
  doc: IProductDocument | IProductLean | FlattenMaps<ProductDocument>
): IProduct => {
  // Convertir categoría al tipo correcto
  let categoria:
    | Types.ObjectId
    | { _id: Types.ObjectId; nombre: string }
    | undefined;

  if ((doc as any).categoria) {
    const cat = (doc as any).categoria;
    if (cat instanceof Types.ObjectId || typeof cat === "string") {
      categoria = new Types.ObjectId(cat);
    } else if (cat && typeof cat === "object") {
      categoria = {
        _id: new Types.ObjectId(cat._id),
        nombre: cat.nombre,
      };
    }
  }

  // Convertir variaciones al tipo correcto
  const variaciones = (doc.variaciones || []).map((v: any) => ({
    ...v,
    _id: v._id instanceof Types.ObjectId ? v._id : new Types.ObjectId(v._id),
    descripcion: v.descripcion || "",
    stockMinimo: v.stockMinimo ?? 5,
    atributos: v.atributos || [],
    imagenes: v.imagenes || [], // ✅ Asegurar que siempre sea un array
    activo: v.activo !== false,
  }));

  return {
    ...doc,
    _id:
      doc._id instanceof Types.ObjectId ? doc._id : new Types.ObjectId(doc._id),
    categoria,
    variaciones,
    descripcionLarga: doc.descripcionLarga || "",
    stockMinimo: doc.stockMinimo ?? 5,
    tieneVariaciones: doc.tieneVariaciones ?? false,
    especificacionesTecnicas: doc.especificacionesTecnicas || [],
    caracteristicas: doc.caracteristicas || [],
    // ❌ imagenesGenerales ELIMINADO
    proveedor: doc.proveedor || "",
    destacado: doc.destacado ?? false,
    activo: doc.activo !== false,
  } as IProduct;
};

const productService = {
  async getAllProducts(): Promise<ServiceResponse<IProduct[]>> {
    try {
      await dbConnect();
      const products = await Product.find({}).populate("categoria").lean();
      return {
        success: true,
        data: products.map(toIProduct),
      };
    } catch (error) {
      return {
        success: false,
        error: "Error al obtener productos",
        details: error instanceof Error ? error.message : "Error desconocido",
      };
    }
  },

  async getProductById(id: string): Promise<IProduct | null> {
    try {
      await dbConnect();
      if (!Types.ObjectId.isValid(id)) throw new Error("ID inválido");
      const product = await Product.findById(id).lean();
      return product ? toIProduct(product) : null;
    } catch (error) {
      console.error("Error en getProductById:", error);
      throw error;
    }
  },

  async createProduct(data: ProductCreateData): Promise<IProduct> {
  
    await dbConnect();

    if (!data.categoria) {
      throw new Error("El campo categoría es requerido");
    }

    let categoriaId: Types.ObjectId;

    if (typeof data.categoria === "object" && "nombre" in data.categoria) {
      if (Types.ObjectId.isValid(data.categoria.nombre)) {
        categoriaId = new Types.ObjectId(data.categoria.nombre);
        const exists = await CategoriaService.categoryExists(categoriaId);
        if (!exists) throw new Error("La categoría especificada no existe");
      } else {
        const categoria = await CategoriaService.findOrCreate(
          data.categoria.nombre
        );
        categoriaId = categoria._id;
      }
    } else {
      categoriaId = new Types.ObjectId(data.categoria as Types.ObjectId);
    }

    const product = new Product({
      ...data,
      categoria: categoriaId,
    });

    await product.save();
    return toIProduct(product.toObject());
  },

  async deleteProduct(id: string): Promise<boolean> {
    await dbConnect();
    if (!Types.ObjectId.isValid(id)) throw new Error("ID inválido");
    const result = await Product.findByIdAndDelete(id);
    return !!result;
  },

  async addProductVariation(
    productId: string,
    variation: Omit<IVariation, "_id">
  ): Promise<{
    success: boolean;
    product?: IProduct;
    variationId?: string;
    variations?: IVariation[];
    error?: string;
  }> {
    try {
      await dbConnect();
      if (!Types.ObjectId.isValid(productId)) {
        return { success: false, error: "ID de producto no válido" };
      }

      // Encontrar el producto primero para obtener la variación creada
      const product = await Product.findById(productId);
      if (!product) {
        return { success: false, error: "Producto no encontrado" };
      }

      // Agregar la variación al array
      product.variaciones.push({
        ...variation,
        stock: variation.stock || 0,
        stockMinimo: variation.stockMinimo ?? 5,
        activo: variation.activo !== false,
        atributos: variation.atributos || [],
        imagenes: variation.imagenes || [], // ✅ Imágenes en variación
      } as IVariation);

      // Marcar que tiene variaciones
      product.tieneVariaciones = true;

      await product.save();

      // Obtener la última variación agregada (la nueva)
      const newVariation = product.variaciones[product.variaciones.length - 1];
      const variationId = newVariation._id.toString();

      const updatedProduct = toIProduct(product.toObject());
      
      return {
        success: true,
        product: updatedProduct,
        variationId,
        variations: updatedProduct.variaciones,
      };
    } catch (error) {
      console.error("Error en addProductVariation:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Error al agregar variación",
      };
    }
  },

  async removeProductVariation(
    productId: string,
    variationId: string
  ): Promise<IProduct> {
    await dbConnect();
    if (!Types.ObjectId.isValid(productId))
      throw new Error("ID de producto no válido");

    const product = await Product.findById(productId);
    if (!product) throw new Error("Producto no encontrado");

    const initialLength = product.variaciones.length;
    product.variaciones = product.variaciones.filter(
      (v: any) => v._id?.toString() !== variationId && v.codigo !== variationId
    );

    if (product.variaciones.length === initialLength) {
      throw new Error("Variación no encontrada");
    }

    product.tieneVariaciones = product.variaciones.length > 0;
    const updated = await product.save();
    return toIProduct(updated.toObject());
  },

  async incrementProductPrice(
    productId: string,
    amount: number,
    variationId?: string
  ): Promise<IProduct> {
    await dbConnect();
    if (!Types.ObjectId.isValid(productId))
      throw new Error("ID de producto no válido");

    const incrementQuery = variationId
      ? {
          $inc: {
            "variaciones.$[elem].precio": amount,
          },
          $set: {
            updatedAt: new Date(),
          },
        }
      : {
          $inc: {
            precio: amount,
          },
          $set: {
            updatedAt: new Date(),
          },
        };

    const options = variationId
      ? {
          new: true,
          arrayFilters: [{ "elem._id": new Types.ObjectId(variationId) }],
        }
      : { new: true };

    const updated = await Product.findByIdAndUpdate(
      productId,
      incrementQuery,
      options
    ).lean<IProductLean & { variaciones: IVariation[]; precio: number }>();

    if (!updated) throw new Error("Producto no encontrado");

    const finalPrice = variationId
      ? updated.variaciones.find((v) => v._id?.toString() === variationId)
          ?.precio
      : updated.precio;

    if (finalPrice && finalPrice <= 0) {
      await this.updateProductPrice(productId, 0, variationId);
      throw new Error("El precio no puede ser menor que 0");
    }

    return toIProduct(updated);
  },

  async updateProductPrice(
    productId: string,
    newPrice: number,
    variationId?: string
  ): Promise<IProduct> {
    await dbConnect();

    if (!Types.ObjectId.isValid(productId)) {
      throw new Error("ID de producto no válido");
    }

    if (newPrice <= 0) {
      throw new Error("El precio debe ser mayor que 0");
    }

    const updateQuery = variationId
      ? {
          $set: {
            "variaciones.$[elem].precio": newPrice,
            updatedAt: new Date(),
          },
        }
      : {
          $set: {
            precio: newPrice,
            updatedAt: new Date(),
          },
        };

    const options = variationId
      ? {
          new: true,
          arrayFilters: [{ "elem._id": new Types.ObjectId(variationId) }],
        }
      : { new: true };

    const updated = await Product.findByIdAndUpdate(
      productId,
      updateQuery,
      options
    ).lean<IProductLean & { variaciones: IVariation[]; precio: number }>();

    if (!updated) throw new Error("Producto no encontrado");
    return toIProduct(updated);
  },

  async incrementProductStock(
    productId: string,
    amount: number,
    variationId?: string
  ): Promise<IProduct> {
    await dbConnect();
    if (!Types.ObjectId.isValid(productId))
      throw new Error("ID de producto no válido");

    const incrementQuery = variationId
      ? {
          $inc: { "variaciones.$[elem].stock": amount },
          $set: { updatedAt: new Date() },
        }
      : { $inc: { stock: amount }, $set: { updatedAt: new Date() } };

    const options = variationId
      ? {
          new: true,
          arrayFilters: [{ "elem._id": new Types.ObjectId(variationId) }],
        }
      : { new: true };

    const updated = await Product.findByIdAndUpdate(
      productId,
      incrementQuery,
      options
    ).lean();
    if (!updated) throw new Error("Producto no encontrado");
    return toIProduct(updated);
  },

  async setProductStock(
    productId: string,
    newStock: number,
    variationId?: string
  ): Promise<IProduct> {
    await dbConnect();
    
    if (!Types.ObjectId.isValid(productId)) {
      throw new Error("ID de producto no válido");
    }

    const setQuery = variationId
      ? {
          $set: { 
            "variaciones.$[elem].stock": newStock,
            updatedAt: new Date() 
          },
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
          arrayFilters: [{ "elem._id": new Types.ObjectId(variationId) }],
        }
      : { new: true };

    const updated = await Product.findByIdAndUpdate(
      productId,
      setQuery,
      options
    ).lean();

    if (!updated) throw new Error("Producto no encontrado");
    return toIProduct(updated);
  },

  // ✅ Nuevo método para agregar imágenes a una variación
  async addVariationImages(
    productId: string,
    variationId: string,
    imageUrls: string[]
  ): Promise<IProduct> {
    await dbConnect();

    if (!Types.ObjectId.isValid(productId) || !Types.ObjectId.isValid(variationId)) {
      throw new Error("ID de producto o variación no válido");
    }

    const updated = await Product.findOneAndUpdate(
      { 
        _id: productId, 
        "variaciones._id": variationId 
      },
      {
        $push: {
          "variaciones.$.imagenes": { $each: imageUrls }
        },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    ).lean();

    if (!updated) throw new Error("Producto o variación no encontrado");
    return toIProduct(updated);
  },

  // ✅ Nuevo método para eliminar imagen de una variación
  async removeVariationImage(
    productId: string,
    variationId: string,
    imageUrl: string
  ): Promise<IProduct> {
    await dbConnect();

    if (!Types.ObjectId.isValid(productId) || !Types.ObjectId.isValid(variationId)) {
      throw new Error("ID de producto o variación no válido");
    }

    const updated = await Product.findOneAndUpdate(
      { 
        _id: productId, 
        "variaciones._id": variationId 
      },
      {
        $pull: {
          "variaciones.$.imagenes": imageUrl
        },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    ).lean();

    if (!updated) throw new Error("Producto o variación no encontrado");
    return toIProduct(updated);
  },

  // ✅ Nuevo método para actualizar imágenes de una variación
  async updateVariationImages(
    productId: string,
    variationId: string,
    imageUrls: string[]
  ): Promise<IProduct> {
    await dbConnect();

    if (!Types.ObjectId.isValid(productId) || !Types.ObjectId.isValid(variationId)) {
      throw new Error("ID de producto o variación no válido");
    }

    const updated = await Product.findOneAndUpdate(
      { 
        _id: productId, 
        "variaciones._id": variationId 
      },
      {
        $set: {
          "variaciones.$.imagenes": imageUrls,
          updatedAt: new Date()
        }
      },
      { new: true }
    ).lean();

    if (!updated) throw new Error("Producto o variación no encontrado");
    return toIProduct(updated);
  }

};

export default productService;