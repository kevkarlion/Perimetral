"use client";

import { useState, useEffect } from "react";
import { IProduct, IVariation } from "@/types/productTypes";

interface PriceManagerModalProps {
  product: IProduct;
  onClose: () => void;
  onPriceUpdated: () => void;
}

export default function PriceManagerModal({
  product,
  onClose,
  onPriceUpdated,
}: PriceManagerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [prices, setPrices] = useState<{
    productPrice: number;
    variations: { [key: string]: number };
  }>({
    productPrice: product.precio || 0,
    variations: {},
  });

  // Inicializar precios de variaciones
  useEffect(() => {
    if (product.tieneVariaciones && product.variaciones) {
      const initialVariationPrices = product.variaciones.reduce(
        (acc, variation) => {
          if (variation._id) {
            acc[variation._id.toString()] = variation.precio || 0;
          }
          return acc;
        },
        {} as { [key: string]: number }
      );
      setPrices({
        productPrice: product.precio || 0,
        variations: initialVariationPrices,
      });
    }
  }, [product]);

  const handlePriceChange = (
    value: string,
    type: "product" | "variation",
    variationId?: string
  ) => {
    const numericValue = parseFloat(value) || 0;

    if (type === "product") {
      setPrices((prev) => ({
        ...prev,
        productPrice: numericValue,
      }));
    } else if (type === "variation" && variationId) {
      setPrices((prev) => ({
        ...prev,
        variations: {
          ...prev.variations,
          [variationId]: numericValue,
        },
      }));
    }
  };

  const updatePrice = async (
    price: number,
    variationId?: string,
    action: "set" | "increment" = "set"
  ) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/stock", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          price,
          variationId,
          action,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el precio");
      }

      setSuccess("Precio actualizado correctamente");
      onPriceUpdated();
    } catch (err) {
      console.error("Error updating price:", err);
      setError(
        err instanceof Error ? err.message : "Error al actualizar el precio"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (product.tieneVariaciones) {
      // Actualizar precios de variaciones
      for (const [variationId, price] of Object.entries(prices.variations)) {
        await updatePrice(price, variationId);
      }
    } else {
      // Actualizar precio del producto principal
      await updatePrice(prices.productPrice);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-start p-6 border-b">
          <h2 className="text-xl font-bold">
            Gestionar Precios - {product.nombre}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {product.tieneVariaciones ? (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Variaciones:</h3>
                {product.variaciones?.map((variation) => (
                  <div
                    key={variation._id?.toString() || variation.codigo}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{variation.medida}</p>
                      <p className="text-sm text-gray-500">
                        Stock: {variation.stock}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-24 border rounded px-2 py-1 text-right"
                        value={prices.variations[variation._id!.toString() ] || 0}
                        onChange={(e) =>
                          handlePriceChange(
                            e.target.value,
                            "variation",
                            variation._id?.toString() 
                          )
                        }
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updatePrice(
                            prices.variations[variation._id!.toString() ],
                            variation._id?.toString()
                          )
                        }
                        className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-200"
                        disabled={isLoading}
                      >
                        {isLoading ? "Guardando..." : "Actualizar"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Precio principal</p>
                    <p className="text-sm text-gray-500">
                      Stock: {product.stock}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-24 border rounded px-2 py-1 text-right"
                      value={prices.productPrice}
                      onChange={(e) =>
                        handlePriceChange(e.target.value, "product")
                      }
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => updatePrice(prices.productPrice)}
                      className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm hover:bg-blue-200"
                      disabled={isLoading}
                    >
                      {isLoading ? "Guardando..." : "Actualizar"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Guardar todos"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}