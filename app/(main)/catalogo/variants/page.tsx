// app/catalogo/variants/page.tsx
import { useProductStore } from '@/app/components/store/product-store'
import VariantPage from '@/app/components/VariantPage/VariantPage'

// Esto evita que Next.js intente prerenderizar estáticamente
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const URL = process.env.BASE_URL
  const res = await fetch(`${URL}/api/stock/${id}`, { cache: 'no-store' })
  const { data: product } = await res.json()

  if (typeof window !== 'undefined') {
    useProductStore.setState(state => ({
      products: state.products.length ? state.products : [product],
      initialized: true
    }))
  }

  return <VariantPage />
}