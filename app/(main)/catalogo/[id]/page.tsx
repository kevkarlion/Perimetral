// app/catalogo/[id]/page.tsx
import { useProductStore } from '@/app/components/store/product-store'
import ProductId from '@/app/components/ProductId/ProductId'

export default async function Page(props: { params: Promise<{ id: string}>}) {
  // 1. Obtener el producto en el servidor (SSR)

  const { id } = await props.params // 👈 aquí esperas params
  const URL = process.env.BASE_URL
  const res = await fetch(`${URL}/api/stock/${id}`)
  const { data: product } = await res.json()
  
  // 2. Hidratar el store (solo en cliente)
  if (typeof window !== 'undefined') {
    useProductStore.setState({ currentProduct: product })
  }

  return <ProductId initialProduct={product} />
}