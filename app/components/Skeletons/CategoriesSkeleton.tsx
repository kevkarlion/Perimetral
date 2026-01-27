'use client'

export default function CategoriesSkeleton() {
  // Creamos un array para simular varias cards mientras cargan
  const skeletonItems = Array.from({ length: 8 })

  return (
    <section className="py-20 bg-gray-50" id="categories-skeleton">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
          <span className="inline-block w-64 h-8 bg-gray-300 rounded-md animate-pulse mx-auto"></span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {skeletonItems.map((_, idx) => (
            <article
              key={idx}
              className="group bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col animate-pulse"
            >
              {/* Imagen */}
              <div className="relative h-56 w-full bg-gray-200" />

              {/* Contenido */}
              <div className="p-5 flex flex-col flex-grow">
                {/* Título */}
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                {/* Descripción */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                {/* Info extra */}
                <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                  <span className="h-3 bg-gray-200 rounded w-1/3"></span>
                  <span className="h-3 bg-gray-200 rounded w-1/4"></span>
                </div>
                {/* Botón */}
                <div className="mt-5 h-10 bg-gray-300 rounded-full w-full"></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
