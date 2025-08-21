// app/catalogo/variants/page.tsx
import { Suspense } from 'react'
import { useProductStore } from '@/app/components/store/product-store'
import VariantPage from '@/app/components/VariantPage/VariantPage'
import { SkeletonVariantPage } from '@/app/components/VariantPage/SkeletonVariantPage'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const URL = process.env.BASE_URL
  const res = await fetch(`${URL}/api/stock/${id}`, { cache: 'no-store' })
  const { data: product } = await res.json()

  // Hidratar el store en cliente solo si no está cargado
  if (typeof window !== 'undefined') {
    useProductStore.setState(state => ({
      products: state.products.length ? state.products : [product],
      initialized: true
    }))
  }

  return (
    <Suspense fallback={<SkeletonVariantPage productName={null} />}>
      <VariantPage />
    </Suspense>
  )
}