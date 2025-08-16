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
    atributos: v.atributos
      ? {
          longitud: v.atributos.longitud || 0,
          altura: v.atributos.altura || 0,
          calibre: v.atributos.calibre || "",
          material: v.atributos.material || "",
          color: v.atributos.color || "",
        }
      : undefined,
    imagenes: v.imagenes || [],
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
    imagenesGenerales: doc.imagenesGenerales || [],
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
    console.log("Creando producto desde servicio...");
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
  ): Promise<{
    success: boolean;
    product?: IProduct;
    variations?: IVariation[];
    error?: string;
  }> {
    try {
      await dbConnect();
      if (!Types.ObjectId.isValid(productId)) {
        return { success: false, error: "ID de producto no válido" };
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
        return { success: false, error: "Producto no encontrado" };
      }

      const product = toIProduct(updated);
      return {
        success: true,
        product,
        variations: product.variaciones,
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

  // Solo cambia estas dos funciones:

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

    // Agrega el tipo explícito aquí
    const updated = await Product.findByIdAndUpdate(
      productId,
      incrementQuery,
      options
    ).lean<IProductLean & { variaciones: IVariation[]; precio: number }>(); // <-- Esta es la línea clave

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

  // Repite el mismo patrón para updateProductPrice:

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

    // Agrega el tipo explícito aquí también
    const updated = await Product.findByIdAndUpdate(
      productId,
      updateQuery,
      options
    ).lean<IProductLean & { variaciones: IVariation[]; precio: number }>(); // <-- Esta es la línea clave

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
};

export default productService;
