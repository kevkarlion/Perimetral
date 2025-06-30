// lib/controllers/productController.ts
import productService from '@/lib/services/productService';
import { v4 as uuidv4 } from 'uuid';
// import { Product } from '@/lib/models/Product'; // Asegúrate de que esta importación sea correcta

// Función para mapear campos antiguos a la nueva estructura
function mapProductFields(productData: any) {
  return {
    id: productData.id || uuidv4(),
    nombre: productData.name || productData.nombre,
    descripcionCorta: productData.description || productData.descripcionCorta,
    descripcionLarga: productData.descripcionLarga || '',
    categoria: productData.category || productData.categoria,
    imagen: productData.image || productData.imagen || '',
    imagenes: productData.images || productData.imagenes || [],
    imagenesAdicionales: productData.additionalImages || productData.imagenesAdicionales || [],
    precio: productData.basePrice ? `$${productData.basePrice}` : productData.precio,
    tieneVariaciones: productData.hasVariations || productData.tieneVariaciones || false,
    destacado: productData.featured || productData.destacado || false,
    stock: productData.stock || 0,
    stockMinimo: productData.minStock || productData.stockMinimo || 0,
    variaciones: productData.variations || productData.variaciones || [],
    especificaciones: productData.specifications || productData.especificaciones || [],
    caracteristicas: productData.features || productData.caracteristicas || []
  };
}

export async function getAllProducts() {
  try {
    const products = await productService.getAllProducts();
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return new Response('Error al obtener productos', { status: 500 });
  }
}

export async function createProduct(req: Request) {
  try {
    const body = await req.json();
    const mappedProduct = mapProductFields(body);
    const created = await productService.createProduct(mappedProduct);
    return new Response(JSON.stringify(created), { status: 201 });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return new Response('Error al crear producto', { status: 500 });
  }
}

export async function deleteProductById(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return new Response('ID requerido', { status: 400 });

    await productService.deleteProduct(id);
    return new Response('Producto eliminado', { status: 200 });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return new Response('Error al eliminar producto', { status: 500 });
  }
}

export async function updateProduct(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response('ID del producto es requerido', { status: 400 });
    }

    const body = await req.json();
    const mappedProduct = mapProductFields(body);
    
    // Asegúrate de incluir el ID correcto en los datos a actualizar
    const updateData = {
      ...mappedProduct,
      _id: id // Usamos el ID de la URL
    };

    const updated = await productService.updateProduct(id, updateData);
    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return new Response(JSON.stringify({
      error: 'Error al actualizar producto',
      details: typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : String(error)
    }), { status: 500 });
  }
}