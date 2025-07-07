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

export async function updateProduct(req: Request): Promise<NextResponse<IProduct | { error: string }>> {
  console.log("CONTROLADOR - Inicio de updateProduct");
  try {
    // 1. Parsear URL y body
    const { searchParams } = new URL(req.url);
    const body = await req.json();
    
    // 2. Obtener productId de ambas fuentes (priorizando query params)
    const queryProductId = searchParams.get('id');
    const { productId: bodyProductId, action, variation, variationId } = body;
    const productId = queryProductId || bodyProductId;
    
    console.log("Datos recibidos en controlador:", {
      queryProductId,
      bodyProductId,
      productIdUsed: productId,
      action,
      variation: variation ? '...' : null,
      variationId
    });

    // 3. Validación básica del ID del producto
    if (!productId || !Types.ObjectId.isValid(productId)) {
      console.error("ID de producto no válido:", productId);
      return errorResponse({ error: 'ID de producto no válido' }, 400);
    }

    // 4. Validación de la acción requerida
    if (!action || (action !== 'add-variation' && action !== 'remove-variation')) {
      return errorResponse({ 
        error: 'Acción no válida. Use "add-variation" o "remove-variation"' 
      }, 400);
    }

    // 5. Lógica para AGREGAR variación
    if (action === 'add-variation') {
      // 5.1 Validar que exista la variación en el body
      if (!variation) {
        return errorResponse({ 
          error: 'Datos de variación no proporcionados' 
        }, 400);
      }

      // 5.2 Validar campos obligatorios
      if (!variation.medida?.trim()) {
        return errorResponse({ 
          error: 'El campo "medida" es requerido', 
          field: 'medida' 
        }, 400);
      }
      if (variation.precio <= 0) {
        return errorResponse({ 
          error: 'El precio debe ser mayor a 0', 
          field: 'precio' 
        }, 400);
      }

      // 5.3 Construir objeto completo de variación
      const fullVariation: IVariation = {
        ...variation,
        medida: variation.medida.trim(),
        codigo: variation.codigo || `${productId}-${variation.medida.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        stock: variation.stock || 0,
        stockMinimo: variation.stockMinimo ?? 5,
        atributos: {
          longitud: variation.atributos?.longitud || 0,
          altura: variation.atributos?.altura || 0,
          calibre: variation.atributos?.calibre || '',
          material: variation.atributos?.material || '',
          color: variation.atributos?.color || ''
        },
        imagenes: variation.imagenes || [],
        activo: variation.activo !== false
      };

      console.log('Variación completa a enviar al servicio:', fullVariation);
      
      // 5.4 Llamar al servicio
      const updatedProduct = await productService.addProductVariation(productId, fullVariation);
      return NextResponse.json(updatedProduct);
    }

    // 6. Lógica para ELIMINAR variación
    if (action === 'remove-variation') {
      // 6.1 Validar ID de variación
      if (!variationId) {
        return errorResponse({ 
          error: 'ID de variación no proporcionado' 
        }, 400);
      }

      console.log('Eliminando variación:', variationId);
      
      // 6.2 Llamar al servicio
      const updatedProduct = await productService.removeProductVariation(productId, variationId);
      return NextResponse.json(updatedProduct);
    }

  } catch (error) {
    console.error('Error completo en controlador:', error);
    
    // 7. Manejo específico de errores de MongoDB
    if ((error as any).code === 11000) {
      return errorResponse({ 
        error: 'El código de variación ya existe' 
      }, 409);
    }

    // 8. Error genérico
    return errorResponse(
      { 
        error: 'Error al procesar la solicitud',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      500
    );
  }
  
  // 9. Retorno por defecto (no debería alcanzarse)
  return errorResponse({ 
    error: 'Acción no reconocida o datos insuficientes' 
  }, 400);
}