// app/catalogo/[id]/page.tsx
import ProductId from '@/components/ProductId/ProductId'
import { IProduct } from '@/lib/types/productTypes'

interface PageProps {
  product: IProduct; // Recibe el producto directamente
}

export default function Page({ product }: PageProps) {
  return <ProductId  />
}