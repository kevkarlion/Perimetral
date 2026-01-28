'use client'

import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import CategoriesSkeleton from './Skeletons/CategoriesSkeleton'

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ICategory {
  _id: string;
  nombre: string;
  descripcion?: string;
  imagen?: string;
  destacada?: boolean;
}

export default function CategoriesPageHome() {
  const { data, error, isLoading } = useSWR<{
    success: boolean;
    data: ICategory[];
  }>("/api/categories", fetcher);

  if (isLoading) return <CategoriesSkeleton />;

  if (error || !data?.success) {
    return (
      <section className="py-20 bg-gray-50 text-center">
        <p className="text-red-500 text-lg">
          {error?.message || "Error cargando categorías"}
        </p>
      </section>
    );
  }

  const categories = data.data || [];

  return (
    <section className="py-20 bg-background text-foreground construction-pattern" id="categories">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-14">
          Explorá nuestras <span className="text-brand">Categorías</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {categories.map((cat) => (
            <article
              key={cat._id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Imagen */}
              <div className="relative h-56 w-full overflow-hidden">
                {cat.imagen ? (
                  <Image
                    src={cat.imagen}
                    alt={cat.nombre}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Sin imagen</span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-90" />

                {/* Destacada */}
                {cat.destacada && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded shadow">
                    Destacada
                  </span>
                )}

                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg leading-tight">
                    {cat.nombre}
                  </h3>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-5 flex flex-col flex-grow">
                {cat.descripcion && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {cat.descripcion}
                  </p>
                )}

                <Link
                  href={`/categoria?category=${cat._id}`}
                  className="mt-auto inline-block w-full text-center bg-brand text-white py-2.5 rounded-full font-medium hover:bg-brandHover transition-colors"
                >
                  Ver productos
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
