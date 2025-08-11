"use client";

import { useState } from "react";
import { IProduct, IVariation } from "@/types/productTypes";

type Props = {
  onClose: () => void;
  refreshProducts: () => void;
};

export default function AddProductModal({ onClose, refreshProducts }: Props) {
  const [formData, setFormData] = useState<
    Omit<IProduct, "_id" | "createdAt" | "updatedAt">
  >({
    codigoPrincipal: "",
    nombre: "",
    categoria: "",
    descripcionCorta: "",
    descripcionLarga: "",
    imagenesGenerales: [""],
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

  const [newVariation, setNewVariation] = useState<
    Omit<IVariation, "codigo" | "activo">
  >({
    medida: "",
    precio: 0,
    stock: 0,
    stockMinimo: 5,
    atributos: {
      longitud: undefined,
      altura: undefined,
      calibre: "",
      material: "",
      color: "",
    },
  });

  //Dropdown categorias
  const [categories, setCategories] = useState<string[]>([
    'Alambrados',
    'Cercos eléctricos',
    'Mallas',
    'Postes',
    'Accesorios'
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);


  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validación de campos requeridos
    if (!formData.codigoPrincipal.trim())
      newErrors.codigoPrincipal = "Código principal es requerido";
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre es requerido";
    if (!formData.categoria.trim())
      newErrors.categoria = "Categoría es requerida";
    if (!formData.descripcionCorta.trim())
      newErrors.descripcionCorta = "Descripción corta es requerida";

    // Validación específica por tipo de producto
    // 1. Validación para productos SIN variaciones
    if (!formData.tieneVariaciones) {
      if (formData.precio === undefined || formData.precio <= 0) {
        newErrors.precio = "Precio válido es requerido";
      }
      if (formData.stock === undefined || formData.stock < 0) {
        newErrors.stock = "Stock válido es requerido";
      }
    }
    // 2. Validación para productos CON variaciones (¡sin else!)
    if (formData.tieneVariaciones) {
      // 2a. Verificar que haya al menos una variación
      if (formData.variaciones.length === 0) {
        newErrors.variaciones = "Debe agregar al menos una variación";
      }
      // 2b. Validar campos de cada variación
      else {
        formData.variaciones.forEach((variation, index) => {
          if (!variation.medida.trim()) {
            newErrors[`variacion-${index}-medida`] = "Medida es requerida";
          }
          if (variation.precio <= 0) {
            newErrors[`variacion-${index}-precio`] =
              "Precio debe ser mayor a 0";
          }
        });
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const finalValue =
      type === "checkbox" && "checked" in e.target
        ? (e.target as HTMLInputElement).checked
        : type === "number"
        ? Number(value)
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };


  

  const handleVariationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isAttribute = name.startsWith("atributos.");

    if (isAttribute) {
      const attrName = name.split(".")[1];
      setNewVariation((prev) => ({
        ...prev,
        atributos: {
          ...prev.atributos,
          [attrName]:
            attrName === "longitud" || attrName === "altura"
              ? Number(value)
              : value,
        },
      }));
    } else {
      setNewVariation((prev) => ({
        ...prev,
        [name]:
          name === "precio" || name === "stock" || name === "stockMinimo"
            ? Number(value)
            : value,
      }));
    }
  };

  const addVariation = () => {
    if (!newVariation.medida.trim() || newVariation.precio <= 0) {
      setErrors((prev) => ({
        ...prev,
        variaciones:
          "Medida y precio válido son requeridos para cada variación",
      }));
      return;
    }

    const codigoVariacion = `${formData.codigoPrincipal}-${newVariation.medida
      .toUpperCase()
      .replace(/\s+/g, "-")}`;

    setFormData((prev) => ({
      ...prev,
      tieneVariaciones: true, // ← ESTA ES LA CLAVE
      variaciones: [
        ...prev.variaciones,
        {
          ...newVariation,
          codigo: codigoVariacion,
          activo: true,
          precio: Number(newVariation.precio), // Conversión explícita
          stock: Number(newVariation.stock),
        },
      ],
    }));

    // Resetear formulario de variación
    setNewVariation({
      medida: "",
      precio: 0,
      stock: 0,
      stockMinimo: 5,
      atributos: {
        longitud: undefined,
        altura: undefined,
        calibre: "",
        material: "",
        color: "",
      },
    });

    // Limpiar error de variaciones si existía
    setErrors((prev) => ({ ...prev, variaciones: "" }));
  };

  const removeVariation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variaciones: prev.variaciones.filter((_, i) => i !== index),
    }));
  };

  const handleArrayChange = (
    field: keyof IProduct,
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const newArray = [...(prev[field] as string[])];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayField = (field: keyof IProduct) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), ""],
    }));
  };

  const removeArrayField = (field: keyof IProduct, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Preparar datos para enviar
      const productToSend = {
        ...formData,
        // Filtrar arrays para eliminar valores vacíos
        imagenesGenerales: (formData.imagenesGenerales || []).filter(
          (img) => img.trim() !== ""
        ),
        especificacionesTecnicas: (
          formData.especificacionesTecnicas || []
        ).filter((esp) => esp.trim() !== ""),
        caracteristicas: (formData.caracteristicas || []).filter(
          (car) => car.trim() !== ""
        ),

        // Limpiar campos según tipo de producto
        ...(formData.tieneVariaciones
          ? {
              // Si TIENE variaciones, limpiamos los campos individuales
              precio: undefined,
              stock: undefined,
              stockMinimo: undefined,
              // Mantenemos las variaciones existentes
              variaciones: formData.variaciones.map((v) => ({
                ...v,
                // Aseguramos que los valores numéricos sean correctos
                precio: Number(v.precio) || 0,
                stock: Number(v.stock) || 0,
                stockMinimo: Number(v.stockMinimo) || 5,
              })),
            }
          : {
              // Si NO TIENE variaciones, limpiamos el array de variaciones
              variaciones: [],
              // Aseguramos que los valores numéricos sean correctos
              precio: Number(formData.precio) || undefined,
              stock: Number(formData.stock) || undefined,
              stockMinimo: Number(formData.stockMinimo) || 5,
            }),
      };

      // Debug: Verificar datos antes de enviar
      console.log("Datos a enviar:", {
        ...productToSend,
        variaciones: productToSend.variaciones,
        tieneVariaciones: productToSend.tieneVariaciones,
      });

      const response = await fetch("/api/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el producto");
      }

      // Limpiar formulario después de éxito
      setFormData({
        codigoPrincipal: "",
        nombre: "",
        categoria: "",
        descripcionCorta: "",
        descripcionLarga: "",
        imagenesGenerales: [""],
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
    }
  };

  const labelClass = "block font-semibold text-gray-700 mb-1";
  const inputClass =
    "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400";
  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[1000px] max-w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">Agregar nuevo producto</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {errors.form && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p>{errors.form}</p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-4 gap-x-8 gap-y-6"
          noValidate
        >
          {/* Sección de identificación */}
          <div className="col-span-4 border-b pb-4 mb-4">
            <h3 className="text-lg font-semibold">Información básica</h3>
          </div>

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
              className={`${inputClass} ${
                errors.codigoPrincipal ? "border-red-500" : ""
              }`}
              value={formData.codigoPrincipal}
              onChange={handleChange}
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
              className={`${inputClass} ${
                errors.nombre ? "border-red-500" : ""
              }`}
              value={formData.nombre}
              onChange={handleChange}
            />
            {errors.nombre && <p className={errorClass}>{errors.nombre}</p>}
          </div>

          {/* Categoría */}
          <div className="col-span-2">
            <label htmlFor="categoria" className={labelClass}>
              Categoría <span className="text-red-600">*</span>
            </label>

            <div className="flex gap-2">
              <select
                id="categoria"
                name="categoria"
                className={`${inputClass} ${
                  errors.categoria ? "border-red-500" : ""
                } flex-1`}
                value={formData.categoria}
                onChange={handleChange}
                onFocus={() => setShowAddCategory(false)}
              >
                <option value="">Seleccione una categoría</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="bg-gray-200 hover:bg-gray-300 px-3 rounded"
              >
                {showAddCategory ? "✕" : "+"}
              </button>
            </div>

            {showAddCategory && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Nueva categoría"
                  className={`${inputClass} flex-1`}
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newCategory.trim()) {
                      setCategories([...categories, newCategory.trim()]);
                      setFormData((prev) => ({
                        ...prev,
                        categoria: newCategory.trim(),
                      }));
                      setNewCategory("");
                      setShowAddCategory(false);
                    }
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Agregar
                </button>
              </div>
            )}

            {errors.categoria && (
              <p className={errorClass}>{errors.categoria}</p>
            )}
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
              className={`${inputClass} ${
                errors.descripcionCorta ? "border-red-500" : ""
              }`}
              value={formData.descripcionCorta}
              onChange={handleChange}
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
            {formData.imagenesGenerales?.map((img, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`URL imagen ${index + 1}`}
                  className={inputClass}
                  value={img}
                  onChange={(e) =>
                    handleArrayChange(
                      "imagenesGenerales",
                      index,
                      e.target.value
                    )
                  }
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField("imagenesGenerales", index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("imagenesGenerales")}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              + Agregar otra imagen
            </button>
          </div>

          {/* Sección de stock y precios */}
          <div className="col-span-4 border-b pb-4 mb-4 mt-4">
            <h3 className="text-lg font-semibold">Stock y precios</h3>
          </div>

          {/* Tiene variaciones */}
          <div className="col-span-4 flex items-center gap-2">
            <input
              id="tieneVariaciones"
              type="checkbox"
              name="tieneVariaciones"
              checked={formData.tieneVariaciones}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label
              htmlFor="tieneVariaciones"
              className="font-semibold text-gray-700"
            >
              Este producto tiene variaciones (tamaños, medidas, etc.)
            </label>
          </div>

          {/* Campos para productos SIN variaciones */}
          {!formData.tieneVariaciones && (
            <>
              <div className="col-span-1">
                <label htmlFor="precio" className={labelClass}>
                  Precio unitario <span className="text-red-600">*</span>
                </label>
                <input
                  id="precio"
                  type="number"
                  name="precio"
                  min="0"
                  step="0.01"
                  className={`${inputClass} ${
                    errors.precio ? "border-red-500" : ""
                  }`}
                  value={formData.precio || ""}
                  onChange={handleChange}
                />
                {errors.precio && <p className={errorClass}>{errors.precio}</p>}
              </div>

              <div className="col-span-1">
                <label htmlFor="stock" className={labelClass}>
                  Stock inicial <span className="text-red-600">*</span>
                </label>
                <input
                  id="stock"
                  type="number"
                  name="stock"
                  min="0"
                  className={`${inputClass} ${
                    errors.stock ? "border-red-500" : ""
                  }`}
                  value={formData.stock || ""}
                  onChange={handleChange}
                />
                {errors.stock && <p className={errorClass}>{errors.stock}</p>}
              </div>
            </>
          )}

          {/* Stock mínimo */}
          <div className="col-span-1">
            <label htmlFor="stockMinimo" className={labelClass}>
              Stock mínimo <span className="text-red-600">*</span>
            </label>
            <input
              id="stockMinimo"
              type="number"
              name="stockMinimo"
              min="0"
              className={inputClass}
              value={formData.stockMinimo}
              onChange={handleChange}
              disabled={formData.tieneVariaciones}
            />
          </div>

          {/* Destacado */}
          <div className="col-span-1 flex items-center gap-2">
            <input
              id="destacado"
              type="checkbox"
              name="destacado"
              checked={formData.destacado}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label htmlFor="destacado" className="font-semibold text-gray-700">
              Producto destacado
            </label>
          </div>

          {/* Sección de variaciones */}
          {formData.tieneVariaciones && (
            <div className="col-span-4 mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  Variaciones del producto
                </h3>
                {errors.variaciones && (
                  <p className="text-red-500 text-sm">{errors.variaciones}</p>
                )}
              </div>

              {/* Lista de variaciones existentes */}
              {formData.variaciones.length > 0 && (
                <div className="space-y-2">
                  {formData.variaciones.map((variation, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 gap-4 items-center bg-gray-50 p-3 rounded"
                    >
                      <div>
                        <span className="text-sm font-medium block">
                          Código:
                        </span>
                        <p className="font-mono text-sm">{variation.codigo}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium block">
                          Medida:
                        </span>
                        <p>{variation.medida}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium block">
                          Precio:
                        </span>
                        <p>${variation.precio.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium block">
                          Stock:
                        </span>
                        <p>{variation.stock}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium block">
                          Atributos:
                        </span>
                        <p className="text-sm">
                          {variation.atributos?.longitud &&
                            `${variation.atributos.longitud}m `}
                          {variation.atributos?.calibre &&
                            `${variation.atributos.calibre} `}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariation(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulario para nueva variación */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Agregar nueva variación</h4>
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <label className={labelClass}>Medida*</label>
                    <input
                      type="text"
                      name="medida"
                      placeholder="Ej: 2m, Rollo 500m"
                      className={inputClass}
                      value={newVariation.medida}
                      onChange={handleVariationChange}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Precio*</label>
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
                    <label className={labelClass}>Stock*</label>
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
                    <label className={labelClass}>Longitud (m)</label>
                    <input
                      type="number"
                      name="atributos.longitud"
                      min="0"
                      step="0.1"
                      className={inputClass}
                      value={newVariation.atributos?.longitud || ""}
                      onChange={handleVariationChange}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Calibre</label>
                    <input
                      type="text"
                      name="atributos.calibre"
                      placeholder="Ej: 12mm, 14mm"
                      className={inputClass}
                      value={newVariation.atributos?.calibre || ""}
                      onChange={handleVariationChange}
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={addVariation}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={!newVariation.medida || !newVariation.precio}
                  >
                    Agregar variación
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Especificaciones técnicas */}
          <div className="col-span-4 border-b pb-4 mb-4 mt-4">
            <h3 className="text-lg font-semibold">Especificaciones técnicas</h3>
          </div>

          <div className="col-span-4">
            <label className={labelClass}>Especificaciones</label>
            {formData.especificacionesTecnicas?.map((esp, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Especificación ${index + 1}`}
                  className={inputClass}
                  value={esp}
                  onChange={(e) =>
                    handleArrayChange(
                      "especificacionesTecnicas",
                      index,
                      e.target.value
                    )
                  }
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      removeArrayField("especificacionesTecnicas", index)
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("especificacionesTecnicas")}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              + Agregar especificación
            </button>
          </div>

          {/* Características */}
          <div className="col-span-4">
            <label className={labelClass}>Características</label>
            {formData.caracteristicas?.map((car, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={`Característica ${index + 1}`}
                  className={inputClass}
                  value={car}
                  onChange={(e) =>
                    handleArrayChange("caracteristicas", index, e.target.value)
                  }
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField("caracteristicas", index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField("caracteristicas")}
              className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
            >
              + Agregar característica
            </button>
          </div>

          {/* Botones de acción */}
          <div className="col-span-4 flex justify-end gap-4 mt-8 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Guardar producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
