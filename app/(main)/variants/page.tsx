"use client";

import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { IVariation } from "@/types/ProductFormData";

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Error cargando variaciones");
    return data.data as IVariation[];
  });

export default function VariantsPage() {
  const params = useSearchParams();
  const productId = params.get("productId");
  const router = useRouter();

  // SWR: trae y cachea los datos
  const { data: variations, error, isLoading } = useSWR(
    productId ? `/api/variations?productId=${productId}` : null,
    fetcher,
    {
      refreshInterval: 30000, // opcional: refresca cada 30s
      revalidateOnFocus: true, // refetch si el usuario vuelve a la pestaña
    }
  );

  if (!productId)
    return <p className="text-red-500 mt-24 ml-6">Producto inválido</p>;
  if (isLoading) return <p className="mt-24 ml-6">Cargando variaciones...</p>;
  if (error) return <p className="text-red-500 mt-24 ml-6">{error.message}</p>;

  return (
    <section className="mt-24 p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Variantes del producto
        </h1>
        <p className="text-gray-500">Seleccioná una versión del producto</p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {variations?.map((v) => {
          const cover = v.imagenes?.[0] || "/no-image.png";
          const lowStock =
            v.stockMinimo !== undefined &&
            v.stock !== undefined &&
            v.stock <= v.stockMinimo;

          return (
            <div
              key={v._id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden flex flex-col"
            >
              {/* IMAGEN */}
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={cover}
                  alt={v.nombre}
                  className="w-full h-full object-cover"
                />
                {v.imagenes?.length > 1 && (
                  <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    +{v.imagenes.length - 1}
                  </span>
                )}
              </div>

              {/* CONTENIDO */}
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {v.nombre}
                </h3>

                {v.descripcion && (
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {v.descripcion}
                  </p>
                )}

                {/* PRECIO */}
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  ${Number(v.precio ?? 0).toLocaleString("es-AR")}
                </p>

                {/* MEDIDA */}
                {v.medida && (
                  <p className="text-xs text-gray-400 mb-2">
                    Medida: {v.medida} {v.uMedida}
                  </p>
                )}

                {/* ATRIBUTOS */}
                {v.atributos?.length ? (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {v.atributos.map((a, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                      >
                        {a.nombre}: {a.valor}
                      </span>
                    ))}
                  </div>
                ) : null}

                {/* STOCK */}
                <div className="mb-3">
                  <span className="text-sm text-gray-600">
                    Stock:{" "}
                    <span
                      className={
                        lowStock
                          ? "text-red-500 font-semibold"
                          : "text-green-600 font-semibold"
                      }
                    >
                      {v.stock ?? 0}
                    </span>
                  </span>

                  {lowStock && (
                    <span className="ml-2 text-xs text-red-400">
                      ¡Últimas unidades!
                    </span>
                  )}
                </div>

                {/* CTA */}
                <button
                  onClick={() => router.push(`/variant/${v._id}`)}
                  className="mt-auto bg-brand text-white py-2 rounded-full text-center hover:bg-brandHover transition"
                >
                  Ver detalle
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
