'use client'

import { useEffect } from 'react'
import { useProductStore } from './store/product-store'

export function ProductInitializer() {
  const { initialized, refreshProducts } = useProductStore()

  useEffect(() => {
    if (!initialized) refreshProducts()
  }, [initialized, refreshProducts])

  return null
}
