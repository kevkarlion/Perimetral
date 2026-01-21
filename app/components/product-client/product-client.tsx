"use client"

import { useEffect } from "react"
import { useProductUIStore } from "@/backend/lib/stores/product-ui.store"

export function ProductClient({ product }: { product: any }) {
  const { setCurrentProduct, selectVariant } = useProductUIStore()

  useEffect(() => {
    setCurrentProduct(product)
    return () => selectVariant(null)
  }, [product])

  return (
    <div>
      <h1>{product.nombre}</h1>

      {product.variaciones?.map((v: any) => (
        <button
          key={v._id}
          onClick={() => selectVariant(v._id)}
        >
          {v.nombre}
        </button>
      ))}
    </div>
  )
}
