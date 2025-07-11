// app/catalogo/[id]/page.tsx
import ProductId from '@/components/ProductId/ProductId';
import { IProduct } from '@/lib/types/productTypes';
// import { getProductById } from '@/lib/controllers/productControllers';

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  // Obtener el producto desde la API (SSR)
  // Esto se ejecuta en el servidor, por lo que no tenemos acceso a sessionStorage aquí
  let product: IProduct | null = null;
  
  // try {
  //   product = await getProductById(params.id);
  // } catch (error) {
  //   console.error('Error fetching product:', error);
  //   // Puedes manejar el error de diferentes maneras:
  //   // 1. Redirigir a una página 404
  //   // 2. Mostrar un mensaje de error
  //   // 3. Devolver null y dejar que el componente cliente maneje la carga
  // }

  return (
    <ProductId 
      product={product || undefined} // Pasamos undefined si es null para que el componente cliente lo maneje
      id={params.id} // Pasamos el ID para búsqueda en cliente si es necesario
    />
  );
}