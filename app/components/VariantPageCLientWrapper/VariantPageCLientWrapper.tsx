'use client'
import dynamic from 'next/dynamic'

const VariantPage = dynamic(() => import('@/app/components/VariantPage/VariantPage'), {
  ssr: false,
})

export default function VariantPageClientWrapper() {
  return <VariantPage />
}
