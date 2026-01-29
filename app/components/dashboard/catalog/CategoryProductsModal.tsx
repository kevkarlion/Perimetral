"use client";

import { useState, useEffect } from "react";
import { ICategory } from "@/app/components/store/category-store";
import CreateProductModal from "./CreateProductModal";
import ProductVariationsModal from "./ProductVariationsModal";
import EditProductModal from "@/app/components/dashboard/catalog/EditProductModal";


import { IProductBase } from "@/types/product.frontend";

interface Props {
  product: IProductBase;
  isOpen: boolean;
  onClose: () => void;
}


type ProductWithMeta = IProductBase & {
  codigoPrincipal?: string;
  variationsCount?: number;
};


interface CategoryProductsModalProps {
  isOpen: boolean;
  category: ICategory | null;
  onClose: () => void;
}

export default function CategoryProductsModal({
  isOpen,
  category,
  onClose,
}: CategoryProductsModalProps) {
  const [products, setProducts] = useState<ProductWithMeta[]>([]);
  const [variationsProduct, setVariationsProduct] =
    useState<ProductWithMeta | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editProduct, setEditProduct] =
    useState<ProductWithMeta | null>(null);

  const fetchProducts = async () => {
    if (!category) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/products?categoryId=${category._id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (!result?.data)
        throw new Error(result.error || "Error al traer productos");
      setProducts(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && category) fetchProducts();
  }, [isOpen, category]);

  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-xl text-black font-bold mb-4">
          Productos de la Categoría "{category.nombre}"
        </h2>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Crear Producto Nuevo
        </button>

        {loading && <p>Cargando productos...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <ul className="space-y-1 max-h-96 overflow-y-auto border-t border-gray-200 pt-2">
          {products.map((p) => (
            <li
              key={p._id}
              className="flex justify-between items-center border-b py-2 px-2"
            >
              <div>
                <p className="font-medium flex items-center gap-2 text-black">
                  {p.nombre}

                  {p.variationsCount && p.variationsCount > 1 && (
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      {p.variationsCount} variaciones
                    </span>
                  )}
                </p>

                {p.codigoPrincipal && (
                  <p className="text-sm text-gray-500">
                    Cod: {p.codigoPrincipal}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setVariationsProduct(p)}
                  className="text-white px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-700"
                >
                  Variaciones
                </button>

                <button
                  onClick={() => setEditProduct(p)}
                  className="text-white px-3 py-1 bg-yellow-500 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>

                <button
                  onClick={async () => {
                    if (!confirm(`¿Eliminar el producto "${p.nombre}"?`))
                      return;

                    try {
                      const res = await fetch(`/api/products/${p._id}`, {
                        method: "DELETE",
                      });

                      if (!res.ok) throw new Error("No se pudo eliminar");

                      fetchProducts();
                    } catch (err) {
                      alert("Error eliminando producto");
                    }
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100 text-black"
          >
            Cerrar
          </button>
        </div>

        {createModalOpen && (
          <CreateProductModal
            isOpen={createModalOpen}
            category={category}
            onClose={() => {
              setCreateModalOpen(false);
              fetchProducts();
            }}
          />
        )}

        {variationsProduct && (
          <ProductVariationsModal
            product={variationsProduct}
            isOpen={!!variationsProduct}
            onClose={() => setVariationsProduct(null)}
          />
        )}

        {editProduct && (
          <EditProductModal
            isOpen={!!editProduct}
            product={editProduct}
            onClose={() => {
              setEditProduct(null);
              fetchProducts();
            }}
          />
        )}
      </div>
    </div>
  );
}
