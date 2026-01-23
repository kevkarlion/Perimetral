"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useVariationStore } from "@/app/components/store/variation-store";
import { useRouter } from "next/navigation";

export default function VariantsPage() {
  const params = useSearchParams();
  const productId = params.get("productId");
  const router = useRouter();

  const { variations, fetchByProduct, loading, error } = useVariationStore();

  useEffect(() => {
    if (productId) fetchByProduct(productId);
  }, [productId]);

  if (!productId)
    return <p className="text-red-500 mt-6 ml-6">Producto inválido</p>;
  if (loading) return <p className="mt-6 ml-6">Cargando variaciones...</p>;
  if (error) return <p className="text-red-500 mt-6 ml-6">{error}</p>;

  return (
    <div className="mt-24 p-6">
      {/* Título */}
      <h1 className="text-2xl font-bold mb-2">Variantes del producto</h1>
      <p className="text-gray-600 mb-6">
        Aquí puedes ver todas las variaciones disponibles de este producto.
      </p>

      {/* Grid de Variaciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {variations.map((v) => (
          <div
            key={v._id}
            className="border rounded-lg shadow hover:shadow-lg transition p-6 flex flex-col"
          >
            {/* Imagen principal si existe */}
            {v.imagenes && v.imagenes.length > 0 ? (
              <img
                src={v.imagenes[0]}
                alt={v.nombre}
                className="h-48 w-full object-cover rounded mb-4"
              />
            ) : (
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded mb-4">
                <span className="text-gray-400">Sin imagen</span>
              </div>
            )}

            {/* Información de la variación */}
            <h3 className="text-lg font-semibold mb-2">{v.nombre}</h3>
            <p className="text-gray-700 mb-1">
              Precio:{" "}
              <span className="font-bold">${v.precio?.toLocaleString()}</span>
            </p>
            <p className="text-gray-700 mb-1">
              Stock: <span className="font-semibold">{v.stock}</span>
            </p>
            {v.medida && (
              <p className="text-gray-700 mb-1">
                Medida: {v.medida} {v.uMedida}
              </p>
            )}
            {v.atributos && v.atributos.length > 0 && (
              <p className="text-gray-700 mb-2">
                {v.atributos.map((a) => `${a.nombre}: ${a.valor}`).join(", ")}
              </p>
            )}

            {/* Botón de acción (puede abrir modal de edición) */}
            <button
              className="mt-auto bg-brand text-white py-2 rounded hover:bg-brandHover transition"
              onClick={() => router.push(`/variant/${v._id}`)}
            >
              Ver Detalle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
