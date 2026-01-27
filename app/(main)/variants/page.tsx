'use client'

import { Suspense } from 'react'
import VariantsPage from '@/app/components/VariantsPage/VariantsPage'
import VariantsSkeleton from '@/app/components/Skeletons/VariantsSkeleton'

const Page = () => {
  return (
    <Suspense fallback={<VariantsSkeleton />}>
      <VariantsPage />
    </Suspense>
  )
}

export default Page
