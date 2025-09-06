// components/ProductBasicInfo.tsx
"use client";

import { ProductFormData } from "@/types/productTypes";
import CloudinaryUploader from "@/app/components/CloudinaryUploader";

interface ProductBasicInfoProps {
  formData: ProductFormData;
  errors: Record<string, string>;
  onFieldChange: (field: keyof ProductFormData, value: any) => void;
  onImageUpload: (imageUrl: string) => void;
  onRemoveImage: (index: number) => void;
}

export default function ProductBasicInfo({
  formData,
  errors,
  onFieldChange,
  onImageUpload,
  onRemoveImage
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

        {/* Imágenes generales */}
        <div className="col-span-4">
          <label className={labelClass}>Imágenes del producto</label>
          
          <CloudinaryUploader
            onImageUpload={onImageUpload}
            existingImages={formData.imagenesGenerales.filter(img => img !== '')}
            folder="products"
          />

          {/* Mostrar miniaturas de las imágenes subidas */}
          {formData.imagenesGenerales.filter(img => img !== '').length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Imágenes subidas:</h4>
              <div className="grid grid-cols-4 gap-2">
                {formData.imagenesGenerales
                  .filter(img => img !== '')
                  .map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => onRemoveImage(
                          formData.imagenesGenerales.indexOf(img)
                        )}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar imagen"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}