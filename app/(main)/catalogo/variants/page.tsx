'use client'
import dynamic from 'next/dynamic'

// Este componente se renderiza solo en el cliente (donde `useSearchParams()` funciona)
const VariantPageClient = dynamic(() => import('@/app/components/VariantPage/VariantPage'), {
  ssr: false,
})

export default function ProductVariantsPage() {
  return <VariantPageClient />
}
