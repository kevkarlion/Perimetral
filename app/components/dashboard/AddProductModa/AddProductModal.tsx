// components/AddProductModal.tsx
"use client";

import { useState, useEffect } from "react";
import { ProductFormData, IVariation, ApiErrorResponse } from "@/types/productTypes";
import CategoryManager from "./CategoryManager";
import ProductBasicInfo from "./ProductBasicInfo";
import ProductVariations from "./ProductVariations";
import ProductSpecifications from "./ProductSpecifications";

type Props = {
  onClose: () => void;
  refreshProducts: () => void;
};

export default function AddProductModal({ onClose, refreshProducts }: Props) {
  // Estado principal del formulario
  const [formData, setFormData] = useState<ProductFormData>({
    codigoPrincipal: "",
    nombre: "",
    medida: '',
    categoria: "",
    descripcionCorta: "",
    descripcionLarga: "",
    precio: undefined,
    stock: undefined,
    stockMinimo: 5,
    tieneVariaciones: false,
    variaciones: [],
    destacado: false,
    especificacionesTecnicas: [""],
    caracteristicas: [""],
    proveedor: "",
    activo: true,
  });

  // Manejo de errores
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambios en campos individuales
  const handleFieldChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error si existe
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Manejar cambios en variaciones
  const handleVariationsChange = (variations: IVariation[]) => {
    handleFieldChange("variaciones", variations);
  };

  // Manejar toggle de variaciones
  const handleToggleVariations = (hasVariations: boolean) => {
    handleFieldChange("tieneVariaciones", hasVariations);
  };

  // Manejar subida de imágenes
  // const handleImageUpload = (imageUrl: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     imagenesGenerales: [...prev.imagenesGenerales, imageUrl]
  //   }));
  // };

  // Eliminar imagen
  // const handleRemoveImage = (index: number) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     imagenesGenerales: prev.imagenesGenerales.filter((_, i) => i !== index)
  //   }));
  // };

  // Validación del formulario
 // components/AddProductModal.tsx
// Validación del formulario
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};

  // Validación de campos requeridos
  if (!formData.codigoPrincipal.trim())
    newErrors.codigoPrincipal = "Código principal es requerido";
  if (!formData.nombre.trim()) newErrors.nombre = "Nombre es requerido";
  if (!formData.categoria) newErrors.categoria = "Categoría es requerida";
  if (!formData.descripcionCorta.trim())
    newErrors.descripcionCorta = "Descripción corta es requerida";

  // Siempre validamos que haya al menos una variación
  if (formData.variaciones.length === 0) {
    newErrors.variaciones = "Debe agregar al menos una variación";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // Envío del formulario
 // Envío del formulario
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  if (!validateForm()) {
    setIsSubmitting(false);
    return;
  }

  try {
    // Preparar datos para enviar
    const productToSend = {
      ...formData,
      // Siempre tiene variaciones, así que limpiamos precio y stock del producto base
      precio: undefined,
      stock: undefined,
      stockMinimo: undefined,
      
      // Filtrar arrays para eliminar valores vacíos
      // imagenesGenerales: (formData.imagenesGenerales || []).filter(
      //   (img) => img.trim() !== ""
      // ),
      especificacionesTecnicas: (
        formData.especificacionesTecnicas || []
      ).filter((esp) => esp.trim() !== ""),
      caracteristicas: (formData.caracteristicas || []).filter(
        (car) => car.trim() !== ""
      ),

      // Procesar variaciones
      variaciones: formData.variaciones.map((v) => ({
        ...v,
        precio: Number(v.precio) || 0,
        stock: Number(v.stock) || 0,
        stockMinimo: Number(v.stockMinimo) || 5,
      })),
      
      // Siempre tiene variaciones
      tieneVariaciones: true,
    };

      const response = await fetch("/api/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productToSend),
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorData = data as ApiErrorResponse;
        
        // Mostrar error general
        setErrors(prev => ({
          ...prev,
          form: errorData.error || "Error al crear el producto",
        }));

        // Mostrar errores específicos por campo si existen
        if (errorData.fieldErrors) {
          setErrors(prev => ({
            ...prev,
            ...errorData.fieldErrors
          }));
        }

        setIsSubmitting(false);
        return;
      }

      // Limpiar formulario después de éxito
      setFormData({
        codigoPrincipal: "",
        nombre: "",
        categoria: "",
        medida: '',
        descripcionCorta: "",
        descripcionLarga: "",
        precio: undefined,
        stock: undefined,
        stockMinimo: 5,
        tieneVariaciones: false,
        variaciones: [],
        destacado: false,
        especificacionesTecnicas: [""],
        caracteristicas: [""],
        proveedor: "",
        activo: true,
      });

      refreshProducts();
      onClose();
    } catch (error) {
      console.error("Error al crear producto:", error);
      setErrors((prev) => ({
        ...prev,
        form:
          error instanceof Error ? error.message : "Error al crear el producto",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[1000px] max-w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">producto</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {errors.form && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p>{errors.form}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Sección de identificación */}
          <div className="border-b pb-4 mb-6">
            <h3 className="text-lg font-semibold">Información básica</h3>
          </div>

          <div className="grid grid-cols-4 gap-x-8 gap-y-6 mb-6">
            {/* Categoría */}
            <div className="col-span-2">
              <CategoryManager
                selectedCategory={formData.categoria}
                onCategoryChange={(categoryId) => handleFieldChange("categoria", categoryId)}
                error={errors.categoria}
              />
            </div>

            {/* Información básica del producto */}
            <div className="col-span-4">
              <ProductBasicInfo
                formData={formData}
                errors={errors}
                onFieldChange={handleFieldChange}
                // onImageUpload={handleImageUpload}
                // onRemoveImage={handleRemoveImage}
              />
            </div>
          </div>

          {/* Sección de stock y precios */}
          <div className="border-b pb-4 mb-6">
            <h3 className="text-lg font-semibold">Stock y precios</h3>
          </div>

          <div className="mb-6">
            <ProductVariations
              formData={formData}
              errors={errors}
              onVariationsChange={handleVariationsChange}
              
            />
          </div>

          {/* Sección de especificaciones técnicas */}
          {/* <div className="border-b pb-4 mb-6">
            <h3 className="text-lg font-semibold">Especificaciones técnicas</h3>
          </div> */}

          {/* <div className="mb-6">
            <ProductSpecifications
              formData={formData}
              onFieldChange={handleFieldChange}
            />
          </div> */}

          {/* Botones de acción */}
          <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Guardar producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}