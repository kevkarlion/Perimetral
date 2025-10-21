"use client";
import { useState, useEffect } from "react";
import type { IVariation, IProduct, IAttribute } from "@/types/productTypes";
import type { ApiResponse } from "@/types/apiTypes";
import CloudinaryUploader from "@/app/components/CloudinaryUploader";

type Props = {
  productId: string;
  codigoPrincipal: string;
  onClose: () => void;
  initialVariations: IVariation[];
};

export default function AddVariationModal({
  productId,
  codigoPrincipal,
  onClose,
  initialVariations,
}: Props) {
  const [variation, setVariation] = useState<
    Omit<IVariation, "_id" | "codigo">
  >({
    nombre: "",
    descripcion: "",
    medida: "",
    uMedida: "u",
    precio: 0,
    stock: 0,
    stockMinimo: 5,
    atributos: [],
    imagenes: [],
    activo: true,
  });

  const [newAttribute, setNewAttribute] = useState<IAttribute>({
    nombre: "",
    valor: ""
  });

  const [variations, setVariations] = useState<IVariation[]>(initialVariations);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("general");



  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setVariation((prev) => ({
      ...prev,
      [name]: name === "precio" || name === "stock" || name === "stockMinimo" 
        ? Number(value) 
        : value,
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setVariation((prev) => ({
      ...prev,
      imagenes: [...prev.imagenes, imageUrl],
    }));
  };

  const handleRemoveImage = (index: number) => {
    setVariation((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAttribute((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addAttribute = () => {
    if (newAttribute.nombre.trim() && newAttribute.valor.trim()) {
      setVariation((prev) => ({
        ...prev,
        atributos: [...(prev.atributos ?? []), { ...newAttribute }]
      }));
      setNewAttribute({ nombre: "", valor: "" });
    }
  };

  const removeAttribute = (index: number) => {
    setVariation((prev) => ({
      ...prev,
      atributos: prev.atributos?.filter((_, i) => i !== index)
    }));
  };

  const sendToStockRoute = async (action: string, payload: any) => {
    try {
      const url = `/api/stock?id=${productId}`;

   

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          action,
          ...payload,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Error en la respuesta del servidor: ${response.status} - ${errorText}`
        );
      }

      const result: ApiResponse<IProduct> = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Error al procesar la solicitud");
      }

      return result.data?.variaciones || [];
    } catch (err) {
      console.error("Error en sendToStockRoute:", err);
      throw err;
    }
  };

  const addVariation = async () => {
    if (!variation.nombre?.trim()) {
      setError("El nombre es requerido");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Filtrar atributos vacíos
      const filteredAttributes = variation.atributos?.filter(attr => 
        attr.nombre.trim() && attr.valor.trim()
      );

      // ✅ Generar código basado en el nombre en lugar de la medida
      const codigoBase = variation.nombre.trim().toUpperCase().replace(/\s+/g, "-");
      const codigo = `${codigoPrincipal}-${codigoBase}`;

      const newVariation: Omit<IVariation, "_id"> = {
        ...variation,
        nombre: variation.nombre.trim(),
         medida: variation.medida?.trim() || "", // ✅ Permitir vacío
        uMedida: variation.uMedida?.trim() || "u",
        codigo: codigo,
        atributos: filteredAttributes || [],
        activo: true,
        productId: productId,
      };

      const updatedVariations = await sendToStockRoute("add-variation", {
        variation: newVariation,
      });

      setVariations(updatedVariations);
      
      // Resetear formulario
      setVariation({
        nombre: "",
        descripcion: "",
        medida: "",
        uMedida: "u",
        precio: 0,
        stock: 0,
        stockMinimo: 5,
        atributos: [],
        imagenes: [],
        activo: true,
      });
      setNewAttribute({ nombre: "", valor: "" });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error alagregar variación "
      );
    } finally {
      setIsLoading(false);
    }
  };

  const removeVariation = async (variationId: string) => {
    setIsLoading(true);
    setError("");

    try {
      const updatedVariations = await sendToStockRoute("remove-variation", {
        variationId: variationId,
      });
      
      if (Array.isArray(updatedVariations)) {
        setVariations(updatedVariations);
      } else {
        throw new Error("Respuesta inválida del servidor");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar variación"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  const labelClass = "block font-semibold text-gray-700 mb-1";
  const inputClass =
    "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400";
  const sectionClass = "mb-6 p-4 border rounded-lg";

  const unidadesMedida = [
    { value: "u", label: "Unidad (u)" },
    { value: "m", label: "Metro (m)" },
    { value: "mts", label: "Metros (mts)" },
    { value: "cm", label: "Centímetro (cm)" },
    { value: "mm", label: "Milímetro (mm)" },
    { value: "kg", label: "Kilogramo (kg)" },
    { value: "g", label: "Gramo (g)" },
    { value: "l", label: "Litro (L)" },
    { value: "ml", label: "Mililitro (ml)" },
    { value: "m2", label: "Metro cuadrado (m²)" },
    { value: "caja", label: "Caja" },
    { value: "rollo", label: "Rollo" },
    { value: "jgo", label: "Juego" },
    { value: "par", label: "Par" },
    { value: "bidon", label: "Bidón" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-[800px] max-w-[95vw] h-[90vh] max-h-[90vh] flex flex-col">
        {/* Encabezado fijo */}
        <div className="flex justify-between items-start p-6 border-b">
          <h2 className="text-xl font-bold">Agregar/Eliminar variaciones</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {/* Contenido desplazable */}
        <div className="overflow-y-auto flex-1 p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex border-b mb-4">
              <button
                type="button"
                className={`px-4 py-2 ${
                  activeTab === "general"
                    ? "border-b-2 border-blue-500 font-medium"
                    : ""
                }`}
                onClick={() => setActiveTab("general")}
              >
                General
              </button>
              <button
                type="button"
                className={`px-4 py-2 ${
                  activeTab === "atributos"
                    ? "border-b-2 border-blue-500 font-medium"
                    : ""
                }`}
                onClick={() => setActiveTab("atributos")}
              >
                Atributos
              </button>
              <button
                type="button"
                className={`px-4 py-2 ${
                  activeTab === "imagenes"
                    ? "border-b-2 border-blue-500 font-medium"
                    : ""
                }`}
                onClick={() => setActiveTab("imagenes")}
              >
                Imágenes
              </button>
              <button
                type="button"
                className={`px-4 py-2 ${
                  activeTab === "inventario"
                    ? "border-b-2 border-blue-500 font-medium"
                    : ""
                }`}
                onClick={() => setActiveTab("inventario")}
              >
                Inventario
              </button>
            </div>

            <div className="min-h-[400px]">
              {activeTab === "general" && (
                <div className={sectionClass}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="nombre" className={labelClass}>
                        Nombre *
                      </label>
                      <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        placeholder="Nombre de la variación"
                        className={inputClass}
                        value={variation.nombre}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="medida" className={labelClass}>
                        Medida
                      </label>
                      <input
                        id="medida"
                        name="medida"
                        type="text"
                        placeholder="Ej: 1.70m x 10m"
                        className={inputClass}
                        value={variation.medida}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="uMedida" className={labelClass}>
                        Unidad de Medida
                      </label>
                      <select
                        id="uMedida"
                        name="uMedida"
                        className={inputClass}
                        value={variation.uMedida}
                        onChange={handleChange}
                        disabled={isLoading}
                      >
                        {unidadesMedida.map((unidad) => (
                          <option key={unidad.value} value={unidad.value}>
                            {unidad.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="precio" className={labelClass}>
                        Precio *
                      </label>
                      <input
                        id="precio"
                        name="precio"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="Ej: 1200"
                        className={inputClass}
                        value={variation.precio || ""}
                        onChange={handleChange}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="descripcion" className={labelClass}>
                      Descripción
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      placeholder="Descripción detallada de la variación"
                      className={inputClass}
                      rows={3}
                      value={variation.descripcion}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {activeTab === "atributos" && (
                <div className={sectionClass}>
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Atributos</h4>
                    
                    {variation.atributos?.length! > 0 && (
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {variation.atributos?.map((attr, index) => (
                          <div key={index} className="flex items-center bg-white p-3 rounded border">
                            <span className="text-sm flex-1">
                              <strong>{attr.nombre}:</strong> {attr.valor}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeAttribute(index)}
                              className="text-red-500 hover:text-red-700 text-sm ml-2"
                              title="Eliminar atributo"
                              disabled={isLoading}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1">
                          Nombre del atributo
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          placeholder="Ej: Color, Material, Tamaño"
                          className={inputClass}
                          value={newAttribute.nombre}
                          onChange={handleAttributeChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1">
                          Valor del atributo
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            name="valor"
                            placeholder="Ej: Azul, Cuero, Grande"
                            className={inputClass}
                            value={newAttribute.valor}
                            onChange={handleAttributeChange}
                            disabled={isLoading}
                            onKeyDown={(e) => e.key === "Enter" && addAttribute()}
                          />
                          <button
                            type="button"
                            onClick={addAttribute}
                            className="px-4 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
                            disabled={!newAttribute.nombre.trim() || !newAttribute.valor.trim() || isLoading}
                          >
                            Agregar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "imagenes" && (
                <div className={sectionClass}>
                  <h4 className="font-semibold mb-4">Imágenes de la variación</h4>
                  
                  <CloudinaryUploader
                    onImageUpload={handleImageUpload}
                    existingImages={variation.imagenes}
                    folder="products/variations"
                    
                  />

                  {variation.imagenes.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-medium mb-2 text-sm">Imágenes subidas:</h5>
                      <div className="grid grid-cols-4 gap-2">
                        {variation.imagenes.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`Imagen variación ${index + 1}`}
                              className="w-full h-16 object-cover rounded border"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Eliminar imagen"
                              disabled={isLoading}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "inventario" && (
                <div className={sectionClass}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="stock" className={labelClass}>
                        Stock
                      </label>
                      <input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        className={inputClass}
                        value={variation.stock}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label htmlFor="stockMinimo" className={labelClass}>
                        Stock Mínimo
                      </label>
                      <input
                        id="stockMinimo"
                        name="stockMinimo"
                        type="number"
                        min="0"
                        className={inputClass}
                        value={variation.stockMinimo}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="activo"
                        checked={variation.activo}
                        onChange={(e) =>
                          setVariation((prev) => ({
                            ...prev,
                            activo: e.target.checked,
                          }))
                        }
                        className="mr-2"
                        disabled={isLoading}
                      />
                      <span className={labelClass}>Activo</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <button
                type="button"
                onClick={addVariation}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={
                  isLoading || !variation.nombre?.trim() || variation.precio <= 0
                }
              >
                {isLoading ? "Agregando..." : "Agregar variación"}
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">
                Variaciones actuales
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
                {variations.length > 0 ? (
                  variations.map((v, index) => (
                    <div
                      key={`${v._id}-${index}`}
                      className="flex justify-between items-center border-b pb-2 last:border-b-0"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{v.nombre || v.medida}</span>
                          <span className="text-blue-600">${v.precio.toFixed(2)}</span>
                          {v.uMedida && v.uMedida !== "u" && (
                            <span className="text-sm text-gray-500">({v.uMedida})</span>
                          )}
                        </div>
                        {v.atributos && v.atributos.length > 0 && (
                          <div className="text-xs text-gray-500">
                            {v.atributos.map(attr => `${attr.nombre}: ${attr.valor}`).join(', ')}
                          </div>
                        )}
                        {v.imagenes && v.imagenes.length > 0 && (
                          <div className="text-xs text-green-600 mt-1">
                            {v.imagenes.length} imagen(es)
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariation(v._id as string)}
                        className="text-red-600 hover:text-red-800 text-sm"
                        disabled={isLoading}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm py-2">
                    No hay variaciones agregadas
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer fijo */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-end gap-4">
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
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              disabled={isLoading || variations.length === 0}
              onClick={handleSubmit}
            >
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}