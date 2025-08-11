// lib/controllers/productController.ts
import { NextResponse } from 'next/server';
import { Types } from 'mongoose';
import productService from '@/backend/lib/services/productService';
import Product from '@/backend/lib/models/Product';
import { IProductDocument, IProductPopulated, IProduct, IVariation } from '@/types/productTypes';
import { dbConnect } from '../dbConnect/dbConnect';

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

// En tu controlador
export async function getAllProducts() {
  try {
    
    dbConnect();
    // Usamos populate con tipos explícitos
    const products = await Product.find({})
      .populate<{ categoria: { _id: Types.ObjectId, nombre: string } | null }>('categoria', 'nombre _id')
      .lean<IProductPopulated[]>();

    // Transformamos los ObjectId a strings
    const transformedProducts = products.map(product => ({
      ...product,
      _id: product._id.toString(),
      categoria: product.categoria ? {
        _id: product.categoria._id.toString(),
        nombre: product.categoria.nombre
      } : null,
      variaciones: product.variaciones?.map(v => ({
        ...v,
        _id: v._id?.toString(),
        atributos: v.atributos || undefined
      })) || []
    }));

    console.log('Productos transformados:', transformedProducts);
    return NextResponse.json({
      success: true,
      data: transformedProducts
    });
  } catch (error) {
    console.error('Error en getAllProducts:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al obtener productos',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function createProduct(req: Request) {
  try {

    const body = await req.json();

    // Validación de categoría
    if (body.categoria === null || body.categoria === undefined) {
      return NextResponse.json(
        { success: false, error: 'La categoría es requerida' },
        { status: 400 }
      );
    }

    // Convertir string ID a ObjectId si es necesario
    let categoriaId: Types.ObjectId | null = null;
    
    if (typeof body.categoria === 'string' && Types.ObjectId.isValid(body.categoria)) {
      categoriaId = new Types.ObjectId(body.categoria);
    } else if (body.categoria && typeof body.categoria === 'object' && '_id' in body.categoria) {
      categoriaId = new Types.ObjectId(body.categoria._id);
    } else if (body.categoria instanceof Types.ObjectId) {
      categoriaId = body.categoria;
    } else {
      return NextResponse.json(
        { success: false, error: 'Formato de categoría no válido' },
        { status: 400 }
      );
    }

    // Crear el producto
    const product = new Product({
      ...body,
      categoria: categoriaId,
      variaciones: body.variaciones || [],
      stockMinimo: body.stockMinimo ?? 5,
      activo: body.activo !== false,
      destacado: body.destacado || false
    });

    await product.save();

    // Convertir a formato para respuesta
    const responseData: IProduct = {
      ...product.toObject(),
      _id: product._id.toString(),
      categoria: body.categoria && typeof body.categoria === 'object' 
        ? { 
            _id: body.categoria._id.toString(), 
            nombre: body.categoria.nombre 
          }
        : null
    };

    return NextResponse.json({ success: true, data: responseData }, { status: 201 });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al crear producto',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
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

      
      console.log('Datos enviados a removeProductVariation:', productId, variationId);
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


export async function getProductById(id: string): Promise<NextResponse> {
  try {
    const serviceResponse = await productService.getProductById(id)
    
    if (!serviceResponse) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: serviceResponse
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error en controlador:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' 
          ? error instanceof Error ? error.message : String(error)
          : undefined
      },
      { status: 500 }
    )
  }
}



// Añade estos métodos al controlador existente

export async function updateStock(req: Request): Promise<NextResponse> {
  try {
    const { productId, variationId, stock, action } = await req.json();

    if (!productId || !Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: 'ID de producto no válido' },
        { status: 400 }
      );
    }

    if (action !== 'set' && action !== 'increment') {
      return NextResponse.json(
        { success: false, error: 'Acción no válida. Use "set" o "increment"' },
        { status: 400 }
      );
    }

    if (action === 'set' && (stock === undefined || stock < 0)) {
      return NextResponse.json(
        { success: false, error: 'Stock no válido' },
        { status: 400 }
      );
    }

    if (action === 'increment' && !Number.isInteger(Number(stock))) {
      return NextResponse.json(
        { success: false, error: 'Cantidad no válida' },
        { status: 400 }
      );
    }

    let updatedProduct: IProduct;
    if (action === 'set') {
      updatedProduct = await productService.updateProductStock(
        productId,
        Number(stock),
        variationId
      );
    } else {
      updatedProduct = await productService.incrementProductStock(
        productId,
        Number(stock),
        variationId
      );
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct
    });

  } catch (error) {
    console.error('Error en updateStock:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al actualizar stock',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}