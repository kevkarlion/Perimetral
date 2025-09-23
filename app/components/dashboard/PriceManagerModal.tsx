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
  const [variationPrices, setVariationPrices] = useState<{
    [key: string]: number;
  }>({});

  // Inicializar precios de variaciones
  useEffect(() => {
    if (product.variaciones && product.variaciones.length > 0) {
      const initialPrices = product.variaciones.reduce((acc, variation) => {
        if (variation._id) {
          const variationId = variation._id.toString();
          acc[variationId] = variation.precio || 0;
        }
        return acc;
      }, {} as { [key: string]: number });

      setVariationPrices(initialPrices);
    }
  }, [product]);

  const handlePriceChange = (variationId: string, value: string) => {
    const numericValue = parseFloat(value) || 0;

    setVariationPrices((prev) => ({
      ...prev,
      [variationId]: numericValue,
    }));
  };

  const updatePrice = async (
    price: number,
    variationId: string,
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
          variationId,
          price,
          action: action,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el precio");
      }

      const result = await response.json();
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

  const updateSingleVariation = async (variationId: string) => {
    const price = variationPrices[variationId];
    if (price !== undefined && price >= 0) {
      await updatePrice(price, variationId, "set");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const updatePromises = Object.entries(variationPrices)
        .filter(([_, price]) => price >= 0)
        .map(([variationId, price]) => updatePrice(price, variationId, "set"));

      await Promise.all(updatePromises);
      setSuccess("Todos los precios han sido actualizados correctamente");
      onPriceUpdated();
    } catch (err) {
      console.error("Error updating prices:", err);
      setError(
        err instanceof Error ? err.message : "Error al actualizar los precios"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Si el producto no tiene variaciones
  if (
    !product.tieneVariaciones ||
    !product.variaciones ||
    product.variaciones.length === 0
  ) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-bold">Gestionar Precios</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>
          <div className="p-4">
            <p className="text-red-600 text-sm">
              Este producto no tiene variaciones configuradas.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-3 py-2 bg-gray-300 rounded text-sm hover:bg-gray-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[95vh] overflow-hidden mx-2 sm:mx-0">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold truncate">
              Precios - {product.nombre}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              {product.codigoPrincipal}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl ml-2"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-140px)]">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-medium text-gray-700 text-sm sm:text-base">
                Variaciones ({product.variaciones.length})
              </h3>

              {product.variaciones
                .map((variation) => {
                  if (!variation._id) {
                    console.warn("Variación sin ID:", variation);
                    return null;
                  }

                  const variationIdString = variation._id.toString();
                  const currentPrice = variationPrices[variationIdString] || 0;
                  const originalPrice = variation.precio || 0;
                  const hasChanged = currentPrice !== originalPrice;

                  return (
                    <div
                      key={variationIdString}
                      className="border rounded-lg bg-gray-50 p-3 sm:p-4"
                    >
                      {/* Información de la variación */}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                        {/* Info principal */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <p className="font-medium text-base sm:text-lg truncate">
                              {variation.nombre}
                            </p>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded self-start">
                              {variation.codigo}
                            </span>
                          </div>

                          {/* Grid detalles */}
                          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                            <div className="truncate">
                              <span className="font-medium">Medida:</span>{" "}
                              {variation.medida}
                            </div>
                            <div>
                              <span className="font-medium">Stock:</span>{" "}
                              {variation.stock}u
                            </div>
                            {variation.descripcion && (
                              <div className="xs:col-span-2 truncate">
                                <span className="font-medium">
                                  Descripción:
                                </span>{" "}
                                {variation.descripcion}
                              </div>
                            )}
                            <div>
                              <span className="font-medium">Unidad:</span>{" "}
                              {variation.uMedida}
                            </div>
                          </div>
                        </div>

                        {/* Controles de precio */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                          {/* Precio actual */}
                          <div className="text-center sm:text-right">
                            <span className="text-gray-500 text-xs">
                              Actual:
                            </span>
                            {hasChanged ? (
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-400 line-through">
                                  ${originalPrice.toLocaleString()}
                                </span>
                                <span className="text-lg font-bold text-green-600">
                                  ${currentPrice.toLocaleString()}
                                </span>
                              </div>
                            ) : (
                              <p className="text-lg font-bold whitespace-nowrap">
                                ${currentPrice.toLocaleString()}
                              </p>
                            )}
                          </div>

                          {/* Input y botón */}
                          <div className="flex flex-col gap-2 min-w-[120px]">
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500 text-sm">$</span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full border rounded px-2 py-1 sm:px-3 sm:py-2 text-right font-medium text-sm"
                                value={currentPrice}
                                onChange={(e) =>
                                  handlePriceChange(
                                    variationIdString,
                                    e.target.value
                                  )
                                }
                                disabled={isLoading}
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                updateSingleVariation(variationIdString)
                              }
                              className={`px-2 py-1 rounded text-xs sm:text-sm disabled:opacity-50 ${
                                hasChanged
                                  ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                              }`}
                              disabled={isLoading || !hasChanged}
                            >
                              {isLoading ? "Guardando..." : "Actualizar"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
                .filter(Boolean)}
            </div>

            {/* Footer */}
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
              <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                  {product.variaciones.length} variación(es)
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50 text-sm border rounded"
                    disabled={isLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                    disabled={isLoading}
                  >
                    {isLoading ? "Guardando..." : "Guardar todos"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
