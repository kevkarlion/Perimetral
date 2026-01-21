// ClientInitializers.tsx
'use client'
import { ProductInitializer } from '@/app/components/ProductInitializer'
import { CategoryInitializer } from '@/app/components/CategoryInitializer'

export function ClientInitializers() {
  return (
    <>
      <CategoryInitializer />
      <ProductInitializer />
    </>
  )
}
