'use client'

export default function VariantsSkeleton() {
  const skeletonItems = Array.from({ length: 3 })

  return (
    <div className="mt-20  lg:mt-12 px-4 md:px-6 ">
      {/* Breadcrumb Skeleton */}
      <div className="flex gap-2 items-center mb-4">
        <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
        <span className="text-gray-400">›</span>
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
        <span className="text-gray-400">›</span>
        <div className="w-28 h-4 bg-gray-300 rounded animate-pulse"></div>
      </div>

      {/* Header Skeleton */}
      <div className="mb-6">
        <div className="h-8 md:h-10 bg-gray-300 rounded w-1/2 mb-2 animate-pulse"></div>
        <div className="h-3 md:h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>

      {/* Grid de Cards - CON EL MISMO ESPACIADO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {skeletonItems.map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden flex flex-col animate-pulse"
          >
            {/* Imagen */}
            <div className="relative h-52 w-full bg-gray-200">
              <div className="absolute top-2 right-2 w-8 h-5 bg-gray-300 rounded"></div>
            </div>

            {/* Contenido */}
            <div className="p-5 flex flex-col flex-grow">
              {/* Título */}
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>

              {/* Descripción */}
              <div className="mb-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>

              {/* Precio */}
              <div className="h-7 bg-gray-300 rounded w-1/3 mb-2"></div>

              {/* Medida */}
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>

              {/* Stock */}
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>

              {/* Botón */}
              <div className="mt-auto h-9 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}