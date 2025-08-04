'use client'
import { useEffect, useState } from 'react'
import { SkeletonVariantPage } from '@/app/components/VariantPage/SkeletonVariantPage'
import { useProductStore } from '@/app/components/store/product-store'
import VariantPage from '@/app/components/VariantPage/VariantPage'

export default function ProductVariantsPage({
  searchParams
}: {
  searchParams: { productId?: string; productName?: string }
}) {
  const [isLoading, setIsLoading] = useState(true)
  const { products, initialized } = useProductStore()
  const productId = searchParams.productId

  // Verificación completa del estado de carga
  useEffect(() => {
    const productLoaded = productId && products.find(p => p._id === productId)
    
    if (initialized && productLoaded) {
      const timer = setTimeout(() => setIsLoading(false), 100) // Pequeño delay para evitar flash
      return () => clearTimeout(timer)
    }
  }, [initialized, products, productId])

  if (isLoading) {
    return <SkeletonVariantPage productName={searchParams.productName} />
  }

  return <VariantPage />
}