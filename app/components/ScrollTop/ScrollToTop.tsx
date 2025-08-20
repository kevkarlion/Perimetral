'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function ScrollToTop() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Lista de rutas donde SI queremos scroll al top
    const scrollToTopPaths = [
      '/catalogo/',
      '/catalogo',
      '/vaiants/',
      '/detalle/',
      // añade más rutas según necesites
    ]
    
    // Verificar si la ruta actual requiere scroll al top
    const shouldScrollToTop = scrollToTopPaths.some(path => pathname.includes(path))
    
    if (shouldScrollToTop) {
      window.scrollTo(0, 0)
    }
  }, [pathname, searchParams])

  return null
}