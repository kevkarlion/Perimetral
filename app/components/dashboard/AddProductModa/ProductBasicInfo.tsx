// components/ProductBasicInfo.tsx
"use client";

import { ProductFormData } from "@/types/productTypes";

interface ProductBasicInfoProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  onFieldChange: (field: keyof ProductFormData, value: any) => void;
}

export default function ProductBasicInfo({
  formData,
  errors,
  onFieldChange,
}: ProductBasicInfoProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const finalValue = type === "checkbox" && "checked" in e.target
      ? (e.target as HTMLInputElement).checked
      : type === "number"
      ? Number(value)
      : value;

    onFieldChange(name as keyof ProductFormData, finalValue);
  };

  const labelClass = "block font-semibold text-gray-700 mb-1";
  const inputClass = "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400";
  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-x-8 gap-y-6">
        {/* Código principal */}
        <div className="col-span-1">
          <label htmlFor="codigoPrincipal" className={labelClass}>
            Código principal <span className="text-red-600">*</span>
          </label>
          <input
            id="codigoPrincipal"
            type="text"
            name="codigoPrincipal"
            placeholder="Ej: CERCO-ALAMBRE"
            className={`${inputClass} ${errors.codigoPrincipal ? "border-red-500" : ""}`}
            value={formData.codigoPrincipal}
            onChange={handleChange}
            required
          />
          {errors.codigoPrincipal && (
            <p className={errorClass}>{errors.codigoPrincipal}</p>
          )}
        </div>

        {/* Nombre */}
        <div className="col-span-3">
          <label htmlFor="nombre" className={labelClass}>
            Nombre del producto <span className="text-red-600">*</span>
          </label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            placeholder="Ej: Alambre de púas galvanizado"
            className={`${inputClass} ${errors.nombre ? "border-red-500" : ""}`}
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          {errors.nombre && <p className={errorClass}>{errors.nombre}</p>}
        </div>

        {/* Proveedor */}
        <div className="col-span-2">
          <label htmlFor="proveedor" className={labelClass}>
            Proveedor
          </label>
          <input
            id="proveedor"
            type="text"
            name="proveedor"
            placeholder="Nombre del proveedor"
            className={inputClass}
            value={formData.proveedor}
            onChange={handleChange}
          />
        </div>

        {/* Descripción corta */}
        <div className="col-span-4">
          <label htmlFor="descripcionCorta" className={labelClass}>
            Descripción corta <span className="text-red-600">*</span>
          </label>
          <input
            id="descripcionCorta"
            type="text"
            name="descripcionCorta"
            placeholder="Breve descripción del producto"
            className={`${inputClass} ${errors.descripcionCorta ? "border-red-500" : ""}`}
            value={formData.descripcionCorta}
            onChange={handleChange}
            required
          />
          {errors.descripcionCorta && (
            <p className={errorClass}>{errors.descripcionCorta}</p>
          )}
        </div>

        {/* Descripción larga */}
        <div className="col-span-4">
          <label htmlFor="descripcionLarga" className={labelClass}>
            Descripción detallada
          </label>
          <textarea
            id="descripcionLarga"
            name="descripcionLarga"
            placeholder="Descripción técnica completa"
            className={`${inputClass} h-24 resize-y`}
            value={formData.descripcionLarga}
            onChange={handleChange}
          />
        </div>

        {/* Información sobre imágenes */}
        <div className="col-span-4">
          <div className="bg-blue-50 p-4 rounded-lg border">
            <h4 className="font-semibold text-blue-800 mb-2">Información sobre imágenes</h4>
            <p className="text-blue-700 text-sm">
              Las imágenes ahora se agregan directamente en cada variación del producto. 
              Puedes subir imágenes específicas para cada variación en la sección de variaciones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}