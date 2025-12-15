// lib/controllers/productController.ts
import { NextResponse } from "next/server";
import { Types } from "mongoose";
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
    { status }
  );
};

// Validación de datos de producto
const validateProductData = (data: Partial<IProduct>): ApiError | null => {
  const requiredFields: Array<keyof IProduct> = [
    "codigoPrincipal",
    "nombre",
    "categoria",
    "descripcionCorta",
  ];

  for (const field of requiredFields) {
    const value = data[field];
    if (!value || value.toString().trim().length === 0) {
      console.error(`Campo ${field} vacío o inválido:`, value);
      return {
        error: `${
          field === "descripcionCorta" ? "Descripción corta" : field
        } es requerido`,
        field,
      };
    }
  }

  if (!data.tieneVariaciones) {
    if (data.precio === undefined || data.precio <= 0) {
      return { error: "Precio válido es requerido", field: "precio" };
    }
    if (data.stock === undefined || data.stock < 0) {
      return { error: "Stock válido es requerido", field: "stock" };
    }
  }

  return null;
};

// Validación de variaciones
const validateVariations = (variations: IVariation[]): ApiError | null => {
  if (!variations || variations.length === 0) {
    return {
      error: "Se requiere al menos una variación",
      field: "variaciones",
    };
  }

  for (const [index, variation] of variations.entries()) {
    if (!variation.medida?.trim() && !variation.uMedida?.trim()) {
      return {
        error: "Medida descriptiva o Unidad de medida es requerida",
        field: `variaciones[${index}].medida`,
      };
    }

    if (variation.precio <= 0) {
      return {
        error: "Precio debe ser mayor a 0",
        field: `variaciones[${index}].precio`,
      };
    }
  }

  return null;
};

// Obtener todos los productos
export async function getAllProducts() {
  const result = await productService.getAllProducts();
  console.log('Resultado de getAllProducts controlador:', result);
  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error,
        details: result.details,
      },
      { status: 500 }
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
export async function createProduct(body: any): Promise<ApiResponse<IProduct>> {
  try {
    const productValidationError = validateProductData(body);
    if (productValidationError) {
      return errorResponse(productValidationError, 400);
    }

    if (body.categoria === null || body.categoria === undefined) {
      return errorResponse(
        {
          error: "La categoría es requerida",
          field: "categoria",
        },
        400
      );
    }

    if (body.tieneVariaciones) {
      const variationValidationError = validateVariations(
        body.variaciones || []
      );
      if (variationValidationError) {
        return errorResponse(variationValidationError, 400);
      }
    } else {
      if (body.precio === undefined || body.precio <= 0) {
        return errorResponse(
          {
            error: "Precio válido es requerido para productos sin variaciones",
            field: "precio",
          },
          400
        );
      }
      if (body.stock === undefined || body.stock < 0) {
        return errorResponse(
          {
            error: "Stock válido es requerido para productos sin variaciones",
            field: "stock",
          },
          400
        );
      }
    }

    let categoriaId: Types.ObjectId | null = null;

    if (
      typeof body.categoria === "string" &&
      Types.ObjectId.isValid(body.categoria)
    ) {
      categoriaId = new Types.ObjectId(body.categoria);
    } else if (
      body.categoria &&
      typeof body.categoria === "object" &&
      "_id" in body.categoria
    ) {
      categoriaId = new Types.ObjectId(body.categoria._id);
    } else if (body.categoria instanceof Types.ObjectId) {
      categoriaId = body.categoria;
    } else {
      return errorResponse(
        {
          error: "Formato de categoría no válido",
          field: "categoria",
        },
        400
      );
    }

    const productData: any = {
      ...body,
      categoria: categoriaId,
      stockMinimo: body.stockMinimo ?? 5,
      activo: body.activo !== false,
      destacado: body.destacado || false,
    };

    let variationsWithProductId: any[] = [];
    if (
      body.tieneVariaciones &&
      body.variaciones &&
      body.variaciones.length > 0
    ) {
      productData.variaciones = [];
      productData.precio = undefined;
      productData.stock = undefined;
      productData.stockMinimo = undefined;

      variationsWithProductId = body.variaciones.map((variation: any) => ({
        ...variation,
        precio: Number(variation.precio) || 0,
        stock: Number(variation.stock) || 0,
        stockMinimo: Number(variation.stockMinimo) || 5,
      }));
    } else {
      productData.variaciones = [];
      productData.precio = Number(body.precio) || 0;
      productData.stock = Number(body.stock) || 0;
    }

    const ProductCollection = Product.collection;
    const result = await ProductCollection.insertOne(productData);

    const productId = result.insertedId;

    if (body.tieneVariaciones && variationsWithProductId.length > 0) {
      const finalVariations = variationsWithProductId.map((variation) => ({
        ...variation,
        productId: productId,
        _id: new Types.ObjectId(),
      }));

      await ProductCollection.updateOne(
        { _id: productId },
        {
          $set: {
            variaciones: finalVariations,
            tieneVariaciones: true,
          },
        }
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return errorResponse(
        {
          error: "Error al recuperar el producto creado",
        },
        500
      );
    }

    // 🔹 MOVIMIENTOS DE STOCK CORREGIDOS - CON previousStock Y newStock
    if (product.variaciones && product.variaciones.length > 0) {
      for (const variation of product.variaciones) {
        const categoryName =
          product.categoria && typeof product.categoria === "object"
            ? product.categoria.nombre
            : "";

        // ✅ CORRECCIÓN: Incluir previousStock y newStock obligatorios
        await StockService.createMovement({
          productId: product._id.toString(),
          variationId: variation._id.toString(),
          type: "initial" as const,
          quantity: variation.stock || 0,
          previousStock: 0, // ✅ Stock anterior (0 porque es inicial)
          newStock: variation.stock || 0, // ✅ Stock nuevo
          reason: "initial_stock",
          productName: product.nombre,
          productCode: product.codigoPrincipal,
          categoryName: categoryName,
          variationName: variation.nombre || "",
          variationCode: variation.codigo || "",
        });
      }
    } else if (!product.tieneVariaciones) {
      // ✅ MOVIMIENTO DE STOCK PARA PRODUCTOS SIN VARIACIONES
      const categoryName =
        product.categoria && typeof product.categoria === "object"
          ? product.categoria.nombre
          : "";

      await StockService.createMovement({
        productId: product._id.toString(),
        type: "initial" as const,
        quantity: product.stock || 0,
        previousStock: 0, // ✅ Stock anterior
        newStock: product.stock || 0, // ✅ Stock nuevo
        reason: "initial_stock",
        productName: product.nombre,
        productCode: product.codigoPrincipal,
        categoryName: categoryName,
      });
    }

    const responseData: IProduct = {
      ...product.toObject(),
      _id: product._id.toString(),
      categoria:
        body.categoria && typeof body.categoria === "object"
          ? {
              _id: body.categoria._id.toString(),
              nombre: body.categoria.nombre,
            }
          : null,
    };

    return NextResponse.json(
      {
        success: true,
        data: responseData,
        message: "Producto creado exitosamente",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating product:", error);

    if (error instanceof Error && "code" in error && error.code === 11000) {
      return errorResponse(
        {
          error: "El código principal ya existe",
          details: "Por favor use un código diferente",
          field: "codigoPrincipal",
        },
        400
      );
    }

    return errorResponse(
      {
        error: "Error al crear producto",
        details: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
}

// Eliminar un producto por ID
export async function deleteProductById(
  req: Request
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
      500
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
        { status: 400 }
      );
    }

    if (price === undefined || isNaN(Number(price))) {
      return NextResponse.json(
        { success: false, error: "Precio no válido" },
        { status: 400 }
      );
    }

    if (action && action !== "set" && action !== "increment") {
      return NextResponse.json(
        { success: false, error: 'Acción no válida. Use "set" o "increment"' },
        { status: 400 }
      );
    }

    let updatedProduct;
    if (action === "increment") {
      updatedProduct = await productService.incrementProductPrice(
        productId,
        Number(price),
        variationId
      );
    } else {
      updatedProduct = await productService.updateProductPrice(
        productId,
        Number(price),
        variationId
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
      { status: 500 }
    );
  }
}

// Actualizar un producto
export async function updateProduct(
  req: Request
): PromiseApiResponse<IProduct> {
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json();

    const productId = searchParams.get("id") || body.productId;
    const { action, variation, variationId } = body;

    if (!productId || !Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: "ID de producto no válido" },
        { status: 400 }
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
        { status: 400 }
      );
    }

    if (action === "add-variation") {
      if (!variation) {
        return NextResponse.json(
          { success: false, error: "Datos de variación no proporcionados" },
          { status: 400 }
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
          { status: 400 }
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
        fullVariation
      );

      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 400 }
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
            stockError
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
          { status: 400 }
        );
      }

      const updatedProduct = await productService.removeProductVariation(
        productId,
        variationId
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
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Error al procesar la solicitud",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: false, error: "Acción no reconocida" },
    { status: 400 }
  );
}

// Obtener un producto por ID
export async function getProductById(id: string): PromiseApiResponse<IProduct> {
  try {
    const serviceResponse = await productService.getProductById(id);

    if (!serviceResponse) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: serviceResponse,
      },
      { status: 200 }
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
      { status: 500 }
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
        { status: 400 }
      );
    }

    if (action !== "set" && action !== "increment" && action !== "decrement") {
      return NextResponse.json(
        {
          success: false,
          error: 'Acción no válida. Use "set", "increment" o "decrement"',
        },
        { status: 400 }
      );
    }

    if (action === "set" && (stock === undefined || stock < 0)) {
      return NextResponse.json(
        { success: false, error: "Stock no válido" },
        { status: 400 }
      );
    }

    if (
      (action === "increment" || action === "decrement") &&
      !Number.isInteger(Number(stock))
    ) {
      return NextResponse.json(
        { success: false, error: "Cantidad no válida" },
        { status: 400 }
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
      { status: 500 }
    );
  }
}
