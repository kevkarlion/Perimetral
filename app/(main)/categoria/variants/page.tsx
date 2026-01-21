// app/catalogo/variants/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import {
  useProductStore,
  IProduct,
} from "@/app/components/store/product-store";
import Link from "next/link";

export default function VariantsPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId") || "";
  const { products, loading, error } = useProductStore();

  if (loading) return <p className="text-center py-8">Cargando...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;

  // Encontramos el producto
  const product = products.find((p) => p._id === productId) as
    | IProduct
    | undefined;
  if (!product)
    return (
      <p className="text-center py-8 text-gray-500">Producto no encontrado</p>
    );

  const variacionesActivas = product.variaciones?.filter((v) => v.activo) || [];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">
          {product.nombre} - Variaciones
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {variacionesActivas.map((variant) => (
            <div
              key={variant._id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-4 flex flex-col"
            >
              <h3 className="font-semibold text-lg mb-2">{variant.nombre}</h3>
              {variant.precio !== undefined && (
                <span className="text-base font-bold text-brand mb-2">
                  ${variant.precio.toLocaleString()}
                </span>
              )}
              <Link
                href={`/categoria/variants/${variant._id}`}
                className="mt-auto inline-block bg-brand text-white text-center py-2 px-4 rounded hover:bg-brandHover transition-colors"
              >
                Ver variante
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
