// app/(main)/catalogo/variants/[id]/page.tsx
import { notFound } from 'next/navigation'
import Product from '@/backend/lib/models/Product'
import ProductId from '@/app/components/ProductId/ProductId'
import { dbConnect } from '@/backend/lib/dbConnect/dbConnect'
import { Types } from 'mongoose'
import { IProduct, IVariation } from '@/types/productTypes'

interface PageProps {
  params: { 
    id: string // ID de la variante
  },
  searchParams: {
    productId?: string // ID del producto padre (opcional)
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  try {
    await dbConnect()

    // 1. Buscar el producto que contiene esta variante
    const productDoc = await Product.findOne({
      'variaciones._id': new Types.ObjectId(params.id)
    }).exec()

    if (!productDoc) {
      return notFound()
    }

    // Convertir a objeto plano y asegurar el tipado
    const product = productDoc.toObject() as IProduct & {
      variaciones: Array<IVariation & { _id: Types.ObjectId }>
    }

    // 2. Encontrar la variante específica
    const variant = product.variaciones.find(v => 
      v._id.toString() === params.id
    )
    
    if (!variant) {
      return notFound()
    }

    // 3. Crear un producto combinado para el componente
    const combinedProduct: IProduct & { medidaSeleccionada: string } = {
      ...product,
      _id: product._id.toString(),
      precio: variant.precio,
      stock: variant.stock,
      medidaSeleccionada: variant.medida, // <-- Aquí enviamos la medida específica
      variaciones: product.variaciones.map(v => ({
        ...v,
        _id: v._id.toString(),
        medida: v.medida // Asegurar que la medida esté en cada variación
      })),
      // Copiar atributos específicos de la variante
      ...(variant.atributos && { atributos: variant.atributos }),
      // Asegurar arrays vacíos si no existen
      especificacionesTecnicas: product.especificacionesTecnicas || [],
      caracteristicas: product.caracteristicas || [],
      imagenesGenerales: product.imagenesGenerales || []
    }

    console.log('Medida enviada:', variant.medida) // Para verificación

    return (
      <ProductId 
        initialProduct={combinedProduct} 
        initialVariationId={params.id}
      />
    )

  } catch (error) {
    console.error('Error loading variant:', error)
    return notFound()
  }
}