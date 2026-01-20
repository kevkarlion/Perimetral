// lib/controllers/productController.ts
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { CreateProductService } from "@/backend/lib/services/CreateProductService";
import productService from "@/backend/lib/services/productService";
import Product from "@/backend/lib/models/Product";
import { IProduct, IVariation } from "@/types/productTypes";
import { StockService } from "@/backend/lib/services/stockService";



// Tipos para respuestas
type ApiError = {
  error: string;
  details?: string | Record<string, unknown> | any[];
  field?: string;
};


type ApiResponse<T> = NextResponse<{
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
  message?: string;
}>;



type PromiseApiResponse<T> = Promise<ApiResponse<T>>;

type ProductData = Omit<IProduct, "_id" | "createdAt" | "updatedAt">;

// Helper para respuestas de error
const errorResponse = (error: ApiError, status: number): ApiResponse<never> => {
  return NextResponse.json(
    {
      success: false,
      error: error.error,
      details: error.details,
      field: error.field,
    },
    { status },
  );
};

// Validación de datos de producto
// const validateProductData = (data: Partial<IProduct>): ApiError | null => {
//   const requiredFields: Array<keyof IProduct> = [
//     "codigoPrincipal",
//     "nombre",
//     "categoria",
//     "descripcionCorta",
//   ];

//   for (const field of requiredFields) {
//     const value = data[field];
//     if (!value || value.toString().trim().length === 0) {
//       console.error(`Campo ${field} vacío o inválido:`, value);
//       return {
//         error: `${
//           field === "descripcionCorta" ? "Descripción corta" : field
//         } es requerido`,
//         field,
//       };
//     }
//   }

//   if (!data.tieneVariaciones) {
//     if (data.precio === undefined || data.precio <= 0) {
//       return { error: "Precio válido es requerido", field: "precio" };
//     }
//     if (data.stock === undefined || data.stock < 0) {
//       return { error: "Stock válido es requerido", field: "stock" };
//     }
//   }

//   return null;
// };

// Validación de variaciones
// const validateVariations = (variations: IVariation[]): ApiError | null => {
//   if (!variations || variations.length === 0) {
//     return {
//       error: "Se requiere al menos una variación",
//       field: "variaciones",
//     };
//   }

//   for (const [index, variation] of variations.entries()) {
//     if (!variation.medida?.trim() && !variation.uMedida?.trim()) {
//       return {
//         error: "Medida descriptiva o Unidad de medida es requerida",
//         field: `variaciones[${index}].medida`,
//       };
//     }

//     if (variation.precio <= 0) {
//       return {
//         error: "Precio debe ser mayor a 0",
//         field: `variaciones[${index}].precio`,
//       };
//     }
//   }

//   return null;
// };

// Obtener todos los productos
export async function getAllProducts() {
  const result = await productService.getAllProducts();
  console.log("Resultado de getAllProducts controlador:", result);
  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
        details: result.details,
      },
      { status: 500 },
    );
  }

  const transformedProducts = result.data?.map((product) => {
    const categoriaObj =
      product.categoria &&
      typeof product.categoria === "object" &&
      "nombre" in product.categoria
        ? {
            _id: (product.categoria._id as any).toString(),
            nombre: product.categoria.nombre,
          }
        : null;

    return {
      ...product,
      _id: product._id?.toString(),
      categoria: categoriaObj,
      variaciones:
        product.variaciones?.map((v) => ({
          ...v,
          _id: v._id?.toString(),
          atributos: v.atributos || undefined,
        })) || [],
    };
  });

  return NextResponse.json({
    success: true,
    data: transformedProducts,
  });
}




// Crear un nuevo producto
//crea producto y en service crea tambien el movimiento
export async function createProductController(req: NextRequest) {
  try {
    const body = await req.json();

    const product = await CreateProductService.createProduct(body);

    return NextResponse.json(
      {
        success: true,
        data: product,
        message: "Producto creado exitosamente",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating product:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}





// Eliminar un producto por ID
export async function deleteProductById(
  req: Request,
): PromiseApiResponse<{ message: string }> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !Types.ObjectId.isValid(id)) {
      return errorResponse({ error: "ID de producto no válido" }, 400);
    }

    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
      return errorResponse({ error: "Producto no encontrado" }, 404);
    }

    return NextResponse.json({
      success: true,
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return errorResponse(
      {
        error: "Error al eliminar producto",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      500,
    );
  }
}

// Actualizar precio
export async function updatePrice(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { productId, price, variationId, action } = body;

    if (!productId || !Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: "ID de producto no válido" },
        { status: 400 },
      );
    }

    if (price === undefined || isNaN(Number(price))) {
      return NextResponse.json(
        { success: false, error: "Precio no válido" },
        { status: 400 },
      );
    }

    if (action && action !== "set" && action !== "increment") {
      return NextResponse.json(
        { success: false, error: 'Acción no válida. Use "set" o "increment"' },
        { status: 400 },
      );
    }

    let updatedProduct;
    if (action === "increment") {
      updatedProduct = await productService.incrementProductPrice(
        productId,
        Number(price),
        variationId,
      );
    } else {
      updatedProduct = await productService.updateProductPrice(
        productId,
        Number(price),
        variationId,
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error en controlador updatePrice:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al procesar la solicitud",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}

// Actualizar un producto
export async function updateProduct(
  req: Request,
): PromiseApiResponse<IProduct> {
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json();

    const productId = searchParams.get("id") || body.productId;
    const { action, variation, variationId } = body;

    if (!productId || !Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: "ID de producto no válido" },
        { status: 400 },
      );
    }

    if (
      !action ||
      (action !== "add-variation" && action !== "remove-variation")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: 'Acción no válida. Use "add-variation" o "remove-variation"',
        },
        { status: 400 },
      );
    }

    if (action === "add-variation") {
      if (!variation) {
        return NextResponse.json(
          { success: false, error: "Datos de variación no proporcionados" },
          { status: 400 },
        );
      }

      // if (!variation.medida?.trim()) {
      //   return NextResponse.json(
      //     {
      //       success: false,
      //       error: 'El campo "medida" es requerido',
      //       field: "medida",
      //     },
      //     { status: 400 }
      //   );
      // }

      if (variation.precio <= 0) {
        return NextResponse.json(
          {
            success: false,
            error: "El precio debe ser mayor a 0",
            field: "precio",
          },
          { status: 400 },
        );
      }

      const fullVariation: Omit<IVariation, "_id"> = {
        ...variation,
        medida: variation.medida?.trim() || "", // Permitir vacío
        codigo:
          variation.codigo ||
          // ✅ Generar código basado en nombre si medida está vacía
          `${productId}-${(variation.nombre || "variacion")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")}-${Date.now()}`,
        stock: variation.stock || 0,
        stockMinimo: variation.stockMinimo ?? 5,
        atributos: variation.atributos || {
          longitud: 0,
          altura: 0,
          calibre: "",
          material: "",
          color: "",
        },
        imagenes: variation.imagenes || [],
        activo: variation.activo !== false,
      };

      const result = await productService.addProductVariation(
        productId,
        fullVariation,
      );

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 },
        );
      }

      // 🔹 MOVIMIENTO DE STOCK CORREGIDO PARA NUEVA VARIACIÓN
      if (variation.stock && variation.stock > 0 && result.variationId) {
        try {
          const product = await Product.findById(productId);
          const categoryName =
            product?.categoria && typeof product.categoria === "object"
              ? product.categoria.nombre
              : "";

          await StockService.createMovement({
            productId: productId,
            variationId: result.variationId,
            type: "initial" as const,
            quantity: variation.stock,
            previousStock: 0, // ✅ Stock anterior (0 porque es nueva)
            newStock: variation.stock, // ✅ Stock nuevo
            reason: "initial_variation_stock",
            productName: product?.nombre || "",
            productCode: product?.codigoPrincipal || "",
            categoryName: categoryName,
            variationName: variation.nombre || "",
            variationCode: variation.codigo || "",
          });
        } catch (stockError) {
          console.error(
            "Error al crear movimiento de stock para variación:",
            stockError,
          );
        }
      }

      return NextResponse.json({
        success: true,
        data: result.product,
      });
    }

    if (action === "remove-variation") {
      if (!variationId) {
        return NextResponse.json(
          { success: false, error: "ID de variación no proporcionado" },
          { status: 400 },
        );
      }

      const updatedProduct = await productService.removeProductVariation(
        productId,
        variationId,
      );
      return NextResponse.json({
        success: true,
        data: updatedProduct,
      });
    }
  } catch (error) {
    console.error("Error en controlador:", error);

    if ((error as any).code === 11000) {
      return NextResponse.json(
        { success: false, error: "El código de variación ya existe" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Error al procesar la solicitud",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { success: false, error: "Acción no reconocida" },
    { status: 400 },
  );
}

// Obtener un producto por ID
export async function getProductById(id: string): PromiseApiResponse<IProduct> {
  try {
    const serviceResponse = await productService.getProductById(id);

    if (!serviceResponse) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: serviceResponse,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error en controlador:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 },
    );
  }
}

// Actualizar stock de un producto
export async function updateStock(req: Request): PromiseApiResponse<any> {
  try {
    const { productId, variationId, stock, action } = await req.json();

    if (!productId || !Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: "ID de producto no válido" },
        { status: 400 },
      );
    }

    if (action !== "set" && action !== "increment" && action !== "decrement") {
      return NextResponse.json(
        {
          success: false,
          error: 'Acción no válida. Use "set", "increment" o "decrement"',
        },
        { status: 400 },
      );
    }

    if (action === "set" && (stock === undefined || stock < 0)) {
      return NextResponse.json(
        { success: false, error: "Stock no válido" },
        { status: 400 },
      );
    }

    if (
      (action === "increment" || action === "decrement") &&
      !Number.isInteger(Number(stock))
    ) {
      return NextResponse.json(
        { success: false, error: "Cantidad no válida" },
        { status: 400 },
      );
    }

    const result = await StockService.updateStock({
      productId,
      variationId,
      stock: Number(stock),
      action: action as "set" | "increment" | "decrement",
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Stock actualizado correctamente",
    });
  } catch (error) {
    console.error("Error en updateStock:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al actualizar stock",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    );
  }
}
