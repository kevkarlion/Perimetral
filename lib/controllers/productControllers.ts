// lib/controllers/productController.ts
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import productService from '@/lib/services/productService';
import { IProduct, IVariation } from '@/lib/types/productTypes';

// Tipos para respuestas
type ApiError = {
  error: string;
  details?: string | Record<string, unknown> | any[];
  field?: string;
};

type ApiResponse<T> = NextResponse<T | ApiError>;
type PromiseApiResponse<T> = Promise<ApiResponse<T>>;

type ProductData = Omit<IProduct, '_id' | 'createdAt' | 'updatedAt'>;

// Helper para respuestas de error
const errorResponse = (error: ApiError, status: number): ApiResponse<never> => {
  return NextResponse.json(error, { status });
};

// Validación de datos de producto
const validateProductData = (data: Partial<IProduct>): ApiError | null => {
  const requiredFields: Array<keyof IProduct> = [
    'codigoPrincipal', 
    'nombre', 
    'categoria', 
    'descripcionCorta'
  ];

  for (const field of requiredFields) {
    const value = data[field];
    if (!value || value.toString().trim().length === 0) {
      console.error(`Campo ${field} vacío o inválido:`, value);
      return { 
        error: `${field === 'descripcionCorta' ? 'Descripción corta' : field} es requerido`,
        field 
      };
    }
  }

  if (!data.tieneVariaciones) {
    if (data.precio === undefined || data.precio <= 0) {
      return { error: 'Precio válido es requerido', field: 'precio' };
    }
    if (data.stock === undefined || data.stock < 0) {
      return { error: 'Stock válido es requerido', field: 'stock' };
    }
  }

  return null;
};

// Validación de variaciones
const validateVariations = (variations: IVariation[]): ApiError | null => {
  if (!variations || variations.length === 0) {
    return { error: 'Se requiere al menos una variación', field: 'variaciones' };
  }

  for (const [index, variation] of variations.entries()) {
    if (!variation.medida?.trim()) {
      return { 
        error: 'Medida es requerida', 
        field: `variaciones[${index}].medida` 
      };
    }
    if (variation.precio <= 0) {
      return { 
        error: 'Precio debe ser mayor a 0', 
        field: `variaciones[${index}].precio` 
      };
    }
  }

  return null;
};

export async function getAllProducts(): PromiseApiResponse<IProduct[]> {
  try {
    const products = await productService.getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return errorResponse(
      { 
        error: 'Error al obtener productos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      500
    );
  }
}

export async function createProduct(body: ProductData): PromiseApiResponse<IProduct> {
  try {
    console.log('Datos recibidos en controlador:', {
      ...body,
      codigoPrincipal: body.codigoPrincipal,
      codigoPrincipalTrimmed: body.codigoPrincipal?.trim(),
      codigoPrincipalLength: body.codigoPrincipal?.length
    });

    // Validación mejorada
    const productError = validateProductData(body);
    if (productError) {
      console.error('Error de validación:', productError);
      return errorResponse(productError, 400);
    }

    if (body.tieneVariaciones) {
      const variationError = validateVariations(body.variaciones || []);
      if (variationError) return errorResponse(variationError, 400);
    }

    // Limpieza de datos antes de enviar al servicio
    const cleanProductData = {
      ...body,
      codigoPrincipal: body.codigoPrincipal.trim(),
      nombre: body.nombre.trim(),
      categoria: body.categoria.trim(),
      descripcionCorta: body.descripcionCorta.trim()
    };

    console.log('Datos limpios para creación:', cleanProductData);
    const createdProduct = await productService.createProduct(cleanProductData);
    return NextResponse.json(createdProduct, { status: 201 });

  } catch (error) {
    console.error('Error completo en createProduct:', error);
    
    if ((error as any).code === 11000) {
      return errorResponse(
        { error: 'El código principal ya existe', field: 'codigoPrincipal' },
        400
      );
    }

    if ((error as any).name === 'ValidationError') {
      const errors = Object.values((error as any).errors).map((err: any) => ({
        field: err.path,
        message: err.message
      }));
      return errorResponse(
        { error: 'Error de validación', details: errors },
        400
      );
    }

    return errorResponse(
      { 
        error: 'Error al crear producto',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      500
    );
  }
}

export async function deleteProductById(req: Request): PromiseApiResponse<{ message: string }> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id || !Types.ObjectId.isValid(id)) {
      return errorResponse({ error: 'ID de producto no válido' }, 400);
    }

    const deleted = await productService.deleteProduct(id);
    if (!deleted) {
      return errorResponse({ error: 'Producto no encontrado' }, 404);
    }

    return NextResponse.json({ message: 'Producto eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return errorResponse(
      { 
        error: 'Error al eliminar producto',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      500
    );
  }
}

export async function updateProduct(req: Request): Promise<NextResponse> {
  console.log("CONTROLADOR - Inicio de updateProduct");
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json();
    
    // Obtener productId de query params o body
    const productId = searchParams.get('id') || body.productId;
    const { action, variation, variationId } = body;

    console.log("Datos recibidos:", {
      productId,
      action,
      variation: variation ? '...' : null,
      variationId
    });

    // Validación básica del ID del producto
    if (!productId || !Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: 'ID de producto no válido' },
        { status: 400 }
      );
    }

    // Validación de la acción requerida
    if (!action || (action !== 'add-variation' && action !== 'remove-variation')) {
      return NextResponse.json(
        { success: false, error: 'Acción no válida. Use "add-variation" o "remove-variation"' },
        { status: 400 }
      );
    }

    // Lógica para AGREGAR variación
    if (action === 'add-variation') {
      if (!variation) {
        return NextResponse.json(
          { success: false, error: 'Datos de variación no proporcionados' },
          { status: 400 }
        );
      }

      if (!variation.medida?.trim()) {
        return NextResponse.json(
          { success: false, error: 'El campo "medida" es requerido', field: 'medida' },
          { status: 400 }
        );
      }

      if (variation.precio <= 0) {
        return NextResponse.json(
          { success: false, error: 'El precio debe ser mayor a 0', field: 'precio' },
          { status: 400 }
        );
      }

      const fullVariation: IVariation = {
        ...variation,
        medida: variation.medida.trim(),
        codigo: variation.codigo || `${productId}-${variation.medida.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        stock: variation.stock || 0,
        stockMinimo: variation.stockMinimo ?? 5,
        atributos: variation.atributos || {
          longitud: 0,
          altura: 0,
          calibre: '',
          material: '',
          color: ''
        },
        imagenes: variation.imagenes || [],
        activo: variation.activo !== false
      };

      const updatedProduct = await productService.addProductVariation(productId, fullVariation);
      
      return NextResponse.json({
        success: true,
        product: updatedProduct,
        variations: updatedProduct.variations
      });
    }

    // Lógica para ELIMINAR variación
    if (action === 'remove-variation') {
      if (!variationId) {
        return NextResponse.json(
          { success: false, error: 'ID de variación no proporcionado' },
          { status: 400 }
        );
      }

      const updatedProduct = await productService.removeProductVariation(productId, variationId);
      
      return NextResponse.json({
        success: true,
        product: updatedProduct,
        variations: updatedProduct.variaciones
      });
    }

  } catch (error) {
    console.error('Error en controlador:', error);
    
    if ((error as any).code === 11000) {
      return NextResponse.json(
        { success: false, error: 'El código de variación ya existe' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: 'Error al procesar la solicitud',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
  
  // Retorno por defecto (no debería alcanzarse)
  return NextResponse.json(
    { success: false, error: 'Acción no reconocida' },
    { status: 400 }
  );
}