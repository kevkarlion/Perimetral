"use client";

import { useEffect } from "react";
import { useProductStore } from "@/app/components/store/product-store";

interface ProductListProps {
  categoryId: string | null;
  selectedProductId?: string | null;
  onSelectProduct: (id: string) => void;
}

export default function ProductList({
  categoryId,
  selectedProductId,
  onSelectProduct,
}: ProductListProps) {
  const {
    loading,
    error,
    initialized,
    refreshProducts,
    getByCategory,
    products,
  } = useProductStore();

  useEffect(() => {
    if (!initialized || products.length === 0) {
      refreshProducts();
    }
  }, [initialized]);

  if (!categoryId)
    return <p className="text-gray-400">Seleccioná una categoría</p>;

  if (loading) return <p>Cargando productos.....</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const filtered = getByCategory(categoryId);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Productoss</h2>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No hay productos en esta categoría.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((p) => (
            <li
              key={p._id}
              onClick={() => onSelectProduct(p._id)}
              className={`cursor-pointer px-3 py-2 rounded border transition
                ${
                  selectedProductId === p._id
                    ? "bg-brand text-white"
                    : "hover:bg-gray-100"
                }`}
            >
              <div className="flex items-center gap-2">
                <div>
                  <p className="font-medium">{p.nombre}</p>
                  <p className="text-sm text-gray-500">
                    Cod: {p.codigoPrincipal}
                  </p>
                </div>

                {p.variationsCount && p.variationsCount > 1 && (
                  <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                    {p.variationsCount} var
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
