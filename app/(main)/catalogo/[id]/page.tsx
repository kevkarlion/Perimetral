// app/catalogo/[id]/page.tsx
import ProductId from '@/components/ProductId/ProductId';
import { IProduct } from '@/lib/types/productTypes';
// import { getProductById } from '@/lib/controllers/productControllers';

interface PageProps {
  params: { id: string };
  searchParams: { product?: string };
}

export default async function Page({ params, searchParams }: PageProps) {
  // 1. Intenta obtener el producto de los searchParams primero
  const searchParamsObj = await searchParams;
  const productFromParams = searchParamsObj.product
  ? JSON.parse(decodeURIComponent(searchParamsObj.product))
  : null;
  // 2. Si no está en los params, haz fetch
  const product = productFromParams;

  return <ProductId product={product} />;
}