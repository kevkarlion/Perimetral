// app/catalogo/page.tsx
'use client'

import { useSearchParams } from "next/navigation"
import CategoryProducts from "@/app/components/CategoryProducts"

export default function Catalogo() {
  const searchParams = useSearchParams()
  const categoryId = searchParams.get("category") || ""

  return <CategoryProducts categoryId={categoryId} />
}
