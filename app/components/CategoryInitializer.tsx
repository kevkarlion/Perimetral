'use client'

import { useEffect } from "react"
import { useCategoryStore } from "./store/category-store"

export function CategoryInitializer() {
  const { initialized, initializeCategories, refreshCategories } = useCategoryStore()

  useEffect(() => {
    if (!initialized) {
      // Podés usar refreshCategories si querés manejar loading/error automáticamente
      refreshCategories()
    }
  }, [initialized, refreshCategories, initializeCategories])

  return null
}
