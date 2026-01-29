'use client'

export default function VariantDetailSkeleton() {
  return (
    <div className="container mx-auto py-7 px-4 sm:px-6 lg:px-8 mt-[88px] md:mt-0 animate-pulse mb-12">
      
      {/* Breadcrumb Skeleton */}
      <div className="flex gap-2 items-center mb-4">
        <div className="w-16 h-4 bg-gray-200 rounded"></div>
        <span className="text-gray-400">›</span>
        <div className="w-20 h-4 bg-gray-200 rounded"></div>
        <span className="text-gray-400">›</span>
        <div className="w-24 h-4 bg-gray-200 rounded"></div>
        <span className="text-gray-400">›</span>
        <div className="w-32 h-4 bg-gray-300 rounded"></div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Galería Skeleton */}
        <div className="flex flex-col lg:flex-row gap-4 lg:sticky lg:top-32 lg:self-start">
          
          {/* Miniaturas skeleton */}
          <div className="lg:w-20 flex lg:flex-col gap-2">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="flex-shrink-0 w-16 h-16 lg:w-full lg:h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>

          {/* Imagen principal skeleton */}
          <div className="flex-1">
            <div className="relative aspect-square bg-gray-200 rounded-lg border border-gray-300"></div>
          </div>
        </div>

        {/* Detalles Skeleton - ORDEN COINCIDENTE */}
        <div className="space-y-6">
          {/* 1. Nombre skeleton */}
          <div>
            <div className="h-10 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>

          {/* 2. Precio skeleton */}
          <div className="py-4 border-b border-gray-200">
            <div className="h-12 bg-gray-300 rounded w-1/3"></div>
          </div>

          {/* 3. Medida skeleton */}
          <div className="py-4 border-b border-gray-200">
            <div className="h-5 bg-gray-200 rounded w-1/4"></div>
          </div>

          {/* 4. Atributos skeleton */}
          <div className="py-4 border-b border-gray-200">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-3"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Estado del stock skeleton */}
          <div className="h-10 bg-gray-200 rounded w-1/4"></div>

          {/* 6. Botón Agregar al carrito skeleton */}
          <div className="pt-4">
            <div className="h-14 bg-gray-300 rounded-lg"></div>
          </div>

          {/* Información adicional skeleton */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-3"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}