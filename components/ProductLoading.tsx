// components/ProductsLoading.tsx
'use client'

import { ProductSkeleton } from "./ProductSkeleton";

export function ProductsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {Array.from({ length: 6 }).map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}