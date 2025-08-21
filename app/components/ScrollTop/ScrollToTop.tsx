'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function ScrollToTop() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Lista de rutas exactas donde SI queremos scroll al top
    const scrollToTopPaths = [
      '/catalogo',
      '/vaiants', // corregí el typo si era "variants"
      '/detalle',
    ]
    
    // Verificar si la ruta actual requiere scroll al top
    const shouldScrollToTop = scrollToTopPaths.some(path => pathname === path)
    
    if (shouldScrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' }) // opcional: smooth scroll
    }
  }, [pathname, searchParams])

  return null
}
