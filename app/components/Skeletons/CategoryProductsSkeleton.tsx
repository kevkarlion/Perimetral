'use client'

export default function CategoryProductsSkeleton() {
  const skeletonItems = Array.from({ length: 3 })

  return (
    <div className="space-y-6 bg-background text-foreground mt-8 lg:mt-0">
      {/* Breadcrumb Skeleton: solo 2 lineas finas */}
      <div className="flex gap-2 items-center text-sm">
        <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
        <span className="text-gray-400">›</span>
        <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Título Skeleton: una sola barra */}
      <div className="h-8 w-1/3 bg-gray-300 rounded animate-pulse"></div>

      {/* Grid de productos skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skeletonItems.map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow overflow-hidden flex flex-col animate-pulse"
          >
            {/* Imagen */}
            <div className="h-40 w-full bg-gray-200" />

            {/* Contenido */}
            <div className="p-3 flex flex-col flex-grow space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="mt-auto h-8 bg-gray-300 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
