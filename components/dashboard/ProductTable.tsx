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
    setIsLoading(true);
    try {
      const response = await fetch("/api/stock");
      if (!response.ok) throw new Error("Error al obtener productos");
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("No se pudieron cargar los productos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddProductModal = () => setShowModal(true);
  const closeAddProductModal = () => setShowModal(false);

  const openVariationModal = (product: IProduct) => {
    setCurrentProduct(product);
    setShowVariationModal(true);
  };

  const closeVariationModal = () => {
    setCurrentProduct(null);
    setShowVariationModal(false);
    fetchProducts();
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/stock?id=${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar producto");
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("No se pudo eliminar el producto");
    } finally {
      setIsLoading(false);
    }
  };

  const openDetailsModal = (product: IProduct) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => setShowDetailsModal(false);

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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variaciones</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                {/* Código, Nombre y Categoría (se mantienen igual) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.codigoPrincipal || <span className="text-gray-400">N/D</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.categoria || <span className="text-gray-400">N/D</span>}
                </td>

                {/* Variaciones con líneas divisorias */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.tieneVariaciones ? (
                    <div className="space-y-2">
                      {product.variaciones?.map((variation, index) => (
                        <div key={index} className="pb-2 border-b border-black last:border-b-0 last:pb-0">
                          <div className="flex items-center">
                            <span className="mr-2">•</span>
                            <span>{variation.medida || 'Sin medida'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-400">No aplica</span>
                  )}
                </td>

                {/* Stock con líneas divisorias */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.tieneVariaciones ? (
                    <div className="space-y-2">
                      {product.variaciones?.map((variation, index) => (
                        <div 
                          key={index} 
                          className={`pb-2 border-b border-black last:border-b-0 last:pb-0 ${variation.stock <= 0 ? 'text-red-500' : ''}`}
                        >
                          {variation.stock ?? 0}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className={(product.stock ?? 0) <= 0 ? 'text-red-500' : ''}>
                      {product.stock ?? 0}
                    </span>
                  )}
                </td>

                {/* Precio con líneas divisorias */}
                <td className="px-6 py-4 text-sm text-gray-500">
                  {product.tieneVariaciones ? (
                    <div className="space-y-2">
                      {product.variaciones?.map((variation, index) => (
                        <div key={index} className="pb-2 border-b border-black last:border-b-0 last:pb-0">
                          ${variation.precio?.toFixed(2) || '0.00'}
                        </div>
                      ))}
                    </div>
                  ) : (
                    `$${product.precio?.toFixed(2) || '0.00'}`
                  )}
                </td>

                {/* Acciones (se mantiene igual) */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-2">
                    <button onClick={() => openVariationModal(product)} className="text-blue-600 hover:text-blue-900" title="Gestionar variaciones">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button onClick={() => openDetailsModal(product)} className="text-green-600 hover:text-green-900" title="Ver detalles">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button onClick={() => deleteProduct(product._id)} className="text-red-600 hover:text-red-900" title="Eliminar producto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modales */}
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