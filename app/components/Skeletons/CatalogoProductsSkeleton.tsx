'use client'

export default function CatalogoProductsSkeleton() {
  const skeletonItems = Array.from({ length: 6 })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {skeletonItems.map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col"
        >
          {/* IMAGEN */}
          <div className="relative w-full h-52 bg-gray-200">
            {/* Flechas */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-300 rounded-full" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-gray-300 rounded-full" />

            {/* Contador */}
            <div className="absolute bottom-2 right-2 w-10 h-4 bg-gray-300 rounded" />

            {/* Badge destacado */}
            <div className="absolute top-2 left-2 w-16 h-4 bg-gray-300 rounded" />
          </div>

          {/* CUERPO */}
          <div className="p-4 flex flex-col flex-grow">
            {/* Categoría */}
            <div className="h-3 w-24 bg-gray-200 rounded mb-2" />

            {/* Título */}
            <div className="h-4 bg-gray-300 rounded w-full mb-1" />
            <div className="h-4 bg-gray-300 rounded w-4/5 mb-2" />

            {/* Descripción */}
            <div className="h-3 bg-gray-200 rounded w-full mb-1" />
            <div className="h-3 bg-gray-200 rounded w-5/6 mb-3" />

            {/* Variantes + estado */}
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded-full" />
            </div>

            {/* Botón */}
            <div className="mt-auto h-9 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
