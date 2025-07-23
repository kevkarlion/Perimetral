// app/catalogo/[id]/page.tsx
import { useProductStore } from '@/components/store/product-store'
import ProductId from '@/components/ProductId/ProductId'

export default async function Page({ params }: { params: { id: string } }) {
  // 1. Obtener el producto en el servidor (SSR)
  const res = await fetch(`http://localhost:3000/api/stock/${params.id}`)
  const { data: product } = await res.json()
  
  // 2. Hidratar el store (solo en cliente)
  if (typeof window !== 'undefined') {
    useProductStore.setState({ currentProduct: product })
  }

  return <ProductId initialProduct={product} />
}