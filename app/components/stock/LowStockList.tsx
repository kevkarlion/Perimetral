"use client";

import { useEffect, useState } from "react";
import { useStock } from "@/app/components/hooks/useStock";
import { StockLevel } from "@/types/stockTypes";
import { Types } from "mongoose";

interface PopulatedProduct {
  _id: Types.ObjectId;
  nombre: string;
  codigoPrincipal: string;
  precio?: number;
  medida?: string;
}

interface Variation {
  _id: Types.ObjectId;
  codigo: string;
  medida: string;
  precio: number;
  stock: number;
  stockMinimo: number;
}

interface ExtendedStockLevel extends StockLevel {
  product?: PopulatedProduct;
  variation?: Variation;
}

export default function LowStockTable() {
  const { getLowStock } = useStock();
  const [lowStock, setLowStock] = useState<ExtendedStockLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowStock = async () => {
      setIsLoading(true);
      try {
        const data = await getLowStock();
        setLowStock(data);
      } catch (error) {
        console.error("Error fetching low stock:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLowStock();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Función para determinar si es un producto sin variación
  const isProductWithoutVariation = (item: ExtendedStockLevel) => {
    return item.variation && item.variation._id.toString() === item.productId?.toString();
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <section id="low-stock" className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Productos con Bajo Stock</h2>
      
      {/* Tabla para desktop */}
      <div className="hidden lg:block bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full border-collapse border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="border p-3">Producto</th>
              <th className="border p-3">Código</th>
              <th className="border p-3">ID</th>
              <th className="border p-3">Medida</th>
              <th className="border p-3">Precio</th>
              <th className="border p-3">Stock Actual</th>
              <th className="border p-3">Stock Mínimo</th>
              <th className="border p-3">Diferencia</th>
              <th className="border p-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map((item) => {
              const product = item.product;
              const variation = item.variation;
              const isWithoutVariation = isProductWithoutVariation(item);
              const itemId = isWithoutVariation ? product?._id.toString() : variation?._id.toString();
              const difference = item.currentStock - item.minimumStock;
              const isCritical = difference < 0;
              
              return (
                <tr key={`${item.productId?.toString()}-${item.variationId?.toString()}`} 
                    className="border-b hover:bg-gray-50">
                  
                  {/* Producto */}
                  <td className="border p-3">
                    {product ? (
                      <div>
                        <div className="font-semibold">{product.nombre}</div>
                        <div className="text-xs text-gray-500">
                          {isWithoutVariation ? "Producto simple" : "Con variaciones"}
                        </div>
                      </div>
                    ) : (
                      <div className="font-mono text-xs text-gray-400">
                        {item.productId?.toString() || "N/A"}
                      </div>
                    )}
                  </td>
                  
                  {/* Código */}
                  <td className="border p-3">
                    {variation ? (
                      <div className="font-medium">{variation.codigo}</div>
                    ) : product ? (
                      <div className="font-medium">{product.codigoPrincipal}</div>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  
                  {/* ID copiable */}
                  <td className="border p-3">
                    {itemId ? (
                      <div className="relative">
                        <button
                          onClick={() => copyToClipboard(itemId, `id-${item.productId}-${itemId}`)}
                          className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-all bg-blue-50 px-2 py-1 rounded w-full text-left truncate"
                          title="Haz clic para copiar el ID completo"
                        >
                          {itemId}
                        </button>
                        {copiedId === `id-${item.productId}-${itemId}` && (
                          <span className="absolute -top-7 left-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            ¡Copiado!
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                  
                  {/* Medida */}
                  <td className="border p-3">
                    {variation?.medida || product?.medida || "N/A"}
                  </td>
                  
                  {/* Precio */}
                  <td className="border p-3 font-mono text-sm">
                    {variation ? formatCurrency(variation.precio) : 
                     product?.precio ? formatCurrency(product.precio) : "N/A"}
                  </td>
                  
                  {/* Stock Actual */}
                  <td className="border p-3 text-center font-medium">
                    {item.currentStock}
                  </td>
                  
                  {/* Stock Mínimo */}
                  <td className="border p-3 text-center">
                    {item.minimumStock}
                  </td>
                  
                  {/* Diferencia */}
                  <td className="border p-3 text-center">
                    <span className={`font-semibold ${
                      difference >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {difference >= 0 ? `+${difference}` : difference}
                    </span>
                  </td>
                  
                  {/* Estado */}
                  <td className="border p-3 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      isCritical ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {isCritical ? "CRÍTICO" : "BAJO"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vista para tablets (md) */}
      <div className="hidden md:block lg:hidden">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full border-collapse border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="border p-2">Producto</th>
                <th className="border p-2">Código</th>
                <th className="border p-2">Stock</th>
                <th className="border p-2">Mínimo</th>
                <th className="border p-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((item) => {
                const product = item.product;
                const variation = item.variation;
                const isWithoutVariation = isProductWithoutVariation(item);
                const difference = item.currentStock - item.minimumStock;
                const isCritical = difference < 0;
                
                return (
                  <tr key={`${item.productId?.toString()}-${item.variationId?.toString()}`} 
                      className="border-b hover:bg-gray-50">
                    <td className="border p-2">
                      {product ? (
                        <div>
                          <div className="font-semibold text-sm">{product.nombre}</div>
                          <div className="text-xs text-gray-500">
                            {isWithoutVariation ? "Simple" : "Con variación"}
                          </div>
                        </div>
                      ) : (
                        <div className="font-mono text-xs text-gray-400 truncate">
                          {item.productId?.toString().slice(0, 8)}...
                        </div>
                      )}
                    </td>
                    <td className="border p-2">
                      {variation ? (
                        <div className="text-sm">{variation.codigo}</div>
                      ) : product ? (
                        <div className="text-sm">{product.codigoPrincipal}</div>
                      ) : (
                        <span className="text-gray-400 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="border p-2 text-center font-medium">
                      {item.currentStock}
                    </td>
                    <td className="border p-2 text-center">
                      <div>{item.minimumStock}</div>
                      <div className={`text-xs font-semibold ${
                        difference >= 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {difference >= 0 ? `+${difference}` : difference}
                      </div>
                    </td>
                    <td className="border p-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        isCritical ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {isCritical ? "CRÍTICO" : "BAJO"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista tipo card en mobile */}
      <div className="md:hidden space-y-3">
        {lowStock.map((item) => {
          const product = item.product;
          const variation = item.variation;
          const isWithoutVariation = isProductWithoutVariation(item);
          const itemId = isWithoutVariation ? product?._id.toString() : variation?._id.toString();
          const difference = item.currentStock - item.minimumStock;
          const isCritical = difference < 0;
          
          return (
            <div
              key={`${item.productId?.toString()}-${item.variationId?.toString()}`}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              {/* Header con estado de stock */}
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  isCritical ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {isCritical ? "STOCK CRÍTICO" : "STOCK BAJO"}
                </span>
                <span className="text-xs text-gray-500">
                  {isWithoutVariation ? "Simple" : "Variación"}
                </span>
              </div>

              {/* Producto */}
              <div className="mb-3">
                <div className="font-semibold text-sm">
                  {product?.nombre || "Producto no disponible"}
                </div>
                <div className="text-xs text-gray-500">
                  Código: {variation?.codigo || product?.codigoPrincipal || item.productId?.toString()}
                </div>
              </div>

              {/* Detalles de precio y medida */}
              <div className="mb-3 p-2 bg-gray-50 rounded">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Medida: </span>
                    <span>{variation?.medida || product?.medida || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Precio: </span>
                    <span className="text-green-600 font-semibold">
                      {variation ? formatCurrency(variation.precio) : 
                       product?.precio ? formatCurrency(product.precio) : "N/A"}
                    </span>
                  </div>
                </div>
                
                {/* ID copiable en mobile */}
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">ID:</div>
                  <button
                    onClick={() => copyToClipboard(itemId!, `id-mobile-${item.productId}-${itemId}`)}
                    className="w-full font-mono text-xs bg-blue-50 p-1 rounded hover:bg-blue-100 cursor-pointer text-left truncate"
                    title="Haz clic para copiar el ID completo"
                  >
                    {itemId}
                  </button>
                  {copiedId === `id-mobile-${item.productId}-${itemId}` && (
                    <div className="text-xs text-green-600 mt-1">¡Copiado!</div>
                  )}
                </div>
              </div>

              {/* Stock */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Stock Actual</div>
                  <div className="font-bold text-lg">{item.currentStock}</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-500">Stock Mínimo</div>
                  <div className="font-bold text-lg">{item.minimumStock}</div>
                </div>
              </div>

              {/* Diferencia */}
              <div className="mt-3 text-center">
                <span className={`text-sm font-semibold ${
                  difference >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  Diferencia: {difference >= 0 ? `+${difference}` : difference}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {lowStock.length === 0 && (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500">No hay productos con bajo stock</p>
        </div>
      )}
    </section>
  );
}