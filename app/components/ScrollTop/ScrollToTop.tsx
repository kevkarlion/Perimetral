'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    const scrollToTopPaths = [
      '/vaiants/',
      '/detalle/',
    ]
    
    if (scrollToTopPaths.some(path => pathname.includes(path))) {
      window.scrollTo(0, 0)
    }
  }, [pathname]) // ✅ solo pathname

  return null
}
