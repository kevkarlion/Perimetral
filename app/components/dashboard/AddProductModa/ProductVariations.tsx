// components/ProductVariations.tsx
"use client";

import { useState } from "react";
import { ProductFormData, IVariation, IAttribute, VariationFormData } from "@/types/productTypes";

interface ProductVariationsProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  onVariationsChange: (variations: IVariation[]) => void;
  
}

export default function ProductVariations({
  formData,
  errors,
  onVariationsChange,
  
}: ProductVariationsProps) {
  const [newVariation, setNewVariation] = useState<VariationFormData>({
    nombre: formData.nombre, // Pre-cargar con el nombre del producto base
    medida: "",
    precio: 0,
    stock: 0,
    stockMinimo: 5,
    atributos: [],
  });

  const [newAttribute, setNewAttribute] = useState<IAttribute>({
    nombre: "",
    valor: ""
  });

  const handleVariationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setNewVariation((prev) => ({
      ...prev,
      [name]: name === "precio" || name === "stock" || name === "stockMinimo"
        ? Number(value)
        : value,
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
      setNewVariation((prev) => ({
        ...prev,
        atributos: [...(prev.atributos || []), { ...newAttribute }]
      }));
      
      setNewAttribute({
        nombre: "",
        valor: ""
      });
    }
  };

  const removeAttribute = (index: number) => {
    setNewVariation((prev) => ({
      ...prev,
      atributos: (prev.atributos || []).filter((_, i) => i !== index)
    }));
  };

  const addVariation = () => {
    if (!newVariation.nombre?.trim() || !newVariation.precio || newVariation.precio <= 0) {
      return;
    }

    const codigoVariacion = `${formData.codigoPrincipal}-${newVariation.nombre
      .toUpperCase()
      .replace(/\s+/g, "-")}`;

    // Crear la nueva variación asegurando que todas las propiedades requeridas estén definidas
    const newVariationWithCode: IVariation = {
      // Propiedades requeridas de IVariation
      codigo: codigoVariacion,
      precio: Number(newVariation.precio) || 0,
      stock: Number(newVariation.stock) || 0,
      
      // Propiedades de VariationFormData
      nombre: newVariation.nombre || "",
      medida: newVariation.medida || "",
      descripcion: newVariation.descripcion || "",
      stockMinimo: Number(newVariation.stockMinimo) || 5,
      atributos: newVariation.atributos || [],
      imagenes: newVariation.imagenes || [],
      
      // Valores por defecto
      activo: true,
    } as IVariation;

    // Convertir todas las variaciones existentes a IVariation
    const existingVariations: IVariation[] = (formData.variaciones || []).map(v => ({
      codigo: v.codigo || `${formData.codigoPrincipal}-${v.nombre?.toUpperCase().replace(/\s+/g, "-") || "VAR"}`,
      precio: Number(v.precio) || 0,
      stock: Number(v.stock) || 0,
      nombre: v.nombre || "",
      medida: v.medida || "",
      descripcion: v.descripcion || "",
      stockMinimo: Number(v.stockMinimo) || 5,
      atributos: v.atributos || [],
      imagenes: v.imagenes || [],
      activo: true,
    } as IVariation));

    onVariationsChange([...existingVariations, newVariationWithCode]);

    // Resetear formulario de variación pero mantener el nombre base
    setNewVariation({
      nombre: formData.nombre, // Mantener el nombre del producto base
      medida: "",
      precio: 0,
      stock: 0,
      stockMinimo: 5,
      atributos: [],
    });
  };

  const removeVariation = (index: number) => {
    // Convertir y filtrar variaciones
    const updatedVariations: IVariation[] = (formData.variaciones || [])
      .map(v => ({
        codigo: v.codigo || `${formData.codigoPrincipal}-${v.nombre?.toUpperCase().replace(/\s+/g, "-") || "VAR"}`,
        precio: Number(v.precio) || 0,
        stock: Number(v.stock) || 0,
        nombre: v.nombre || "",
        medida: v.medida || "",
        descripcion: v.descripcion || "",
        stockMinimo: Number(v.stockMinimo) || 5,
        atributos: v.atributos || [],
        imagenes: v.imagenes || [],
        activo: true,
      } as IVariation))
      .filter((_, i) => i !== index);
    
    onVariationsChange(updatedVariations);
  };

  const labelClass = "block font-semibold text-gray-700 mb-1";
  const inputClass = "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400";
  const errorClass = "text-red-500 text-sm mt-1";

  // Convertir variaciones para mostrar
  const variations: IVariation[] = (formData.variaciones || []).map(v => ({
    codigo: v.codigo || `${formData.codigoPrincipal}-${v.nombre?.toUpperCase().replace(/\s+/g, "-") || "VAR"}`,
    precio: Number(v.precio) || 0,
    stock: Number(v.stock) || 0,
    nombre: v.nombre || "",
    medida: v.medida || "",
    descripcion: v.descripcion || "",
    stockMinimo: Number(v.stockMinimo) || 5,
    atributos: v.atributos || [],
    imagenes: v.imagenes || [],
    activo: true,
  } as IVariation));

  return (
    <div className="space-y-6">
      {/* Información sobre el flujo */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Flujo de trabajo</h3>
        <p className="text-blue-700 text-sm">
          <strong>Categoría:</strong> {formData.categoria ? "Seleccionada" : "Por seleccionar"} → 
          <strong> Producto base:</strong> {formData.nombre || "Por definir"} → 
          <strong> Variaciones:</strong> {variations.length} agregadas
        </p>
      </div>

      {/* Sección de variaciones */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Variaciones del producto
          </h3>
          {errors.variaciones && (
            <p className="text-red-500 text-sm">{errors.variaciones}</p>
          )}
        </div>

        {/* Lista de variaciones existentes */}
        {variations.length > 0 && (
          <div className="space-y-3">
            {variations.map((variation, index) => (
              <div
                key={index}
                className="grid grid-cols-6 gap-4 items-center bg-gray-50 p-4 rounded-lg border"
              >
                <div>
                  <span className="text-sm font-medium block text-gray-600">
                    Código:
                  </span>
                  <p className="font-mono text-sm">{variation.codigo}</p>
                </div>
                <div>
                  <span className="text-sm font-medium block text-gray-600">
                    Nombre específico:
                  </span>
                  <p className="font-medium">{variation.nombre}</p>
                </div>
                <div>
                  <span className="text-sm font-medium block text-gray-600">
                    Precio:
                  </span>
                  <p>${variation.precio.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium block text-gray-600">
                    Stock:
                  </span>
                  <p>{variation.stock}</p>
                </div>
                <div>
                  <span className="text-sm font-medium block text-gray-600">
                    Atributos:
                  </span>
                  <p className="text-sm">
                    {variation.atributos && variation.atributos.length > 0
                      ? variation.atributos.map(attr => `${attr.nombre}: ${attr.valor}`).join(', ')
                      : 'Sin atributos específicos'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariation(index)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-200 rounded"
                  title="Eliminar variación"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Formulario para nueva variación */}
        <div className="bg-gray-50 p-6 rounded-lg border">
          <h4 className="font-medium mb-4 text-lg">Agregar nueva variación</h4>
          
          {/* Campos de la variación */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className={labelClass}>
                Nombre específico de la variación *
                <span className="text-xs text-gray-500 ml-2">
                  (Ej: "Gorro de lana azul", "Silla ergonómica negra")
                </span>
              </label>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre específico de esta variación"
                className={inputClass}
                value={newVariation.nombre || ""}
                onChange={handleVariationChange}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Medida</label>
              <input
                type="text"
                name="medida"
                placeholder="Ej: Talla M, 500ml, 2m"
                className={inputClass}
                value={newVariation.medida || ""}
                onChange={handleVariationChange}
              />
            </div>

            <div>
              <label className={labelClass}>Precio *</label>
              <input
                type="number"
                name="precio"
                min="0"
                step="0.01"
                className={inputClass}
                value={newVariation.precio || ""}
                onChange={handleVariationChange}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Stock inicial *</label>
              <input
                type="number"
                name="stock"
                min="0"
                className={inputClass}
                value={newVariation.stock || ""}
                onChange={handleVariationChange}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Stock mínimo</label>
              <input
                type="number"
                name="stockMinimo"
                min="0"
                className={inputClass}
                value={newVariation.stockMinimo || ""}
                onChange={handleVariationChange}
              />
            </div>

            <div>
              <label className={labelClass}>Descripción específica</label>
              <textarea
                name="descripcion"
                placeholder="Descripción detallada de esta variación"
                className={`${inputClass} h-20 resize-y`}
                value={newVariation.descripcion || ""}
                onChange={handleVariationChange}
              />
            </div>
          </div>

          {/* Atributos de la variación */}
          <div className="mb-6">
            <h5 className="font-medium mb-3">Atributos específicos</h5>
            
            {(newVariation.atributos || []).length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                {(newVariation.atributos || []).map((attr, index) => (
                  <div key={index} className="flex items-center bg-white p-3 rounded border">
                    <span className="text-sm flex-1">
                      <strong>{attr.nombre}:</strong> {attr.valor}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttribute(index)}
                      className="text-red-500 hover:text-red-700 text-sm ml-2"
                      title="Eliminar atributo"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">Nombre del atributo</label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej: Color, Material, Tamaño"
                  className={inputClass}
                  value={newAttribute.nombre}
                  onChange={handleAttributeChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1">Valor del atributo</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="valor"
                    placeholder="Ej: Azul, Cuero, Grande"
                    className={inputClass}
                    value={newAttribute.valor}
                    onChange={handleAttributeChange}
                    onKeyDown={(e) => e.key === "Enter" && addAttribute()}
                  />
                  <button
                    type="button"
                    onClick={addAttribute}
                    className="px-4 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
                    disabled={!newAttribute.nombre.trim() || !newAttribute.valor.trim()}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={addVariation}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium"
              disabled={!newVariation.nombre || !newVariation.precio}
            >
              + Agregar variación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}