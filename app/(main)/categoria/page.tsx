<<<<<<< HEAD
// // app/categoria/page.tsx
// 'use client'

// import CategoryProducts from "@/app/components/CategoryProducts"

// export default function Catalogo() {
//   return <CategoryProducts />
// }
=======
'use client'

import { Suspense } from 'react'
import CategoryProducts from '@/app/components/CategoryProducts'
import CategoryProductsSkeleton from '@/app/components/Skeletons/CategoryProductsSkeleton'

export default function Catalogo() {
  return (
    <Suspense fallback={<CategoryProductsSkeleton />}>
      <CategoryProducts />
    </Suspense>
  )
}
>>>>>>> refactor
