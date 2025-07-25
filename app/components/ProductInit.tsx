// components/ProductInitializer.tsx
'use client'

import { useEffect } from 'react'
import { useProductStore } from '@/app/components/store/product-store'

export function ProductInitializer() {
  const { initialized, initializeProducts, setLoading, setError } = useProductStore()

  useEffect(() => {
    if (!initialized) {
      const loadProducts = async () => {
        setLoading(true)
        try {
          const response = await fetch('/api/stock')
          if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
          
          const result = await response.json()
          if (result?.data) {
            initializeProducts(result.data)
          } else {
            throw new Error(result.error || 'Formato de respuesta inválido')
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Error desconocido')
          setLoading(false)
        }
      }
      loadProducts()
    }
  }, [initialized, initializeProducts, setLoading, setError])

  return null
}