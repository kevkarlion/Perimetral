'use client'

export default function VariantDetailSkeleton() {
  return (
    <div className="container mx-auto py-7 px-4 sm:px-6 lg:px-8 mt-[88px] md:mt-0 animate-pulse">
      
      {/* Breadcrumb */}
      <div className="flex gap-2 items-center mb-4">
        <div className="h-4 w-12 bg-gray-200 rounded"></div>
        <span className="text-gray-400">›</span>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <span className="text-gray-400">›</span>
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Galería */}
        <div className="flex flex-col lg:flex-row-reverse gap-4 lg:sticky lg:top-32 lg:self-start">
          <div className="w-full">
            <div className="relative aspect-square bg-gray-200 rounded-lg border border-gray-300" />
          </div>
        </div>

        {/* Detalles */}
        <div className="space-y-8">
          <div className="space-y-3">
            {/* Nombre */}
            <div className="h-10 w-3/4 bg-gray-300 rounded"></div>
            {/* Descripción */}
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
          </div>

          {/* Precio */}
          <div className="flex items-baseline gap-3">
            <div className="h-8 w-32 bg-gray-300 rounded"></div>
          </div>

          {/* Stock */}
          <div className="h-4 w-24 bg-gray-200 rounded"></div>

          {/* Botón */}
          <div className="h-12 w-full bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}
