'use client';

import { useState, useEffect } from "react";
import AddProductModal from "./AddProductModal";
import AddVariationModal from "./AddVariationModal";
import DetailsProductModal from "./DetailsProductModal";
import { IProduct, IVariation } from "@/lib/types/productTypes";

export default function ProductTable() {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/stock");
      if (!response.ok) throw new Error("Error al obtener productos");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("No se pudieron cargar los productos");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateProductVariations = async (updatedVariations: IVariation[]) => {
    if (!currentProduct) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/stock?id=${currentProduct._id}&action=variations`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          variaciones: updatedVariations.map(v => ({
            ...v,
            precio: Number(v.precio) || 0,
            stock: Number(v.stock) || 0
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar variaciones");
      }

      setProducts(prevProducts =>
        prevProducts.map(p =>
          p._id === currentProduct._id ? { ...p, variaciones: updatedVariations } : p
        )
      );

      closeVariationModal();
    } catch (error) {
      console.error("Error updating variations:", error);
      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron guardar las variaciones"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openAddProductModal = () => setShowModal(true);
  const closeAddProductModal = () => setShowModal(false);

  const openVariationModal = (product: IProduct) => {
    setCurrentProduct(product);
    setShowVariationModal(true);
  };

  const closeVariationModal = () => {
    setCurrentProduct(null);
    setShowVariationModal(false);
    setError(null);
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/stock?id=${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar producto");
      }

      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("No se pudo eliminar el producto");
    }
  };

  const openDetailsModal = (product: IProduct) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setSelectedProduct(null);
    setShowDetailsModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={openAddProductModal}
          disabled={isLoading}
        >
          {isLoading ? "Cargando..." : "+ Nuevo Producto"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código*</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre*</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría*</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variaciones</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock*</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio*</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((prod) => (
              <tr key={prod._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {prod.codigoPrincipal || <span className="text-red-500">No definido</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prod.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{prod.categoria}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {prod.tieneVariaciones ? (
                    <ul className="space-y-1">
                      {prod.variaciones?.map((v, i) => (
                        <li key={i} className="flex justify-between">
                          <span>{v.medida}</span>
                          <span className="font-medium">${v.precio}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">Sin variaciones</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prod.tieneVariaciones ? (
                    prod.variaciones?.reduce((sum, v) => sum + (v.stock || 0), 0)
                  ) : (
                    prod.stock ?? <span className="text-red-500">Requerido</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {prod.tieneVariaciones ? (
                    "Ver variaciones"
                  ) : (
                    prod.precio ? `$${prod.precio}` : <span className="text-red-500">Requerido</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openVariationModal(prod)}
                      className="text-blue-600 hover:text-blue-900"
                      disabled={isLoading || !prod.tieneVariaciones}
                    >
                      Variaciones
                    </button>
                    <button
                      onClick={() => openDetailsModal(prod)}
                      className="text-green-600 hover:text-green-900"
                      disabled={isLoading}
                    >
                      Detalles
                    </button>
                    <button
                      onClick={() => deleteProduct(prod._id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={isLoading}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AddProductModal
          onClose={closeAddProductModal}
          refreshProducts={fetchProducts}
        />
      )}

      {showVariationModal && currentProduct && (
        <AddVariationModal
          productId={currentProduct._id}
          initialVariations={currentProduct.variaciones || []}
          onClose={closeVariationModal}
         
        />
      )}

      {showDetailsModal && selectedProduct && (
        <DetailsProductModal
          product={selectedProduct}
          onClose={closeDetailsModal}
        />
      )}
    </div>
  );
}