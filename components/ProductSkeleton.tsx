// components/ProductSkeleton.tsx
'use client'

import { Skeleton } from "@/components/ui/skeleton";

export function ProductSkeleton() {
  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden">
      {/* Contenedor de imagen */}
      <div className="relative w-full h-80 bg-gray-100 overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      
      {/* Contenido */}
      <div className="p-4 flex-grow flex flex-col space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="ml-1 h-4 w-4" />
        </div>
      </div>
    </div>
  );
}