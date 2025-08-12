"use client";

import { useState, useEffect } from "react";
import { IProduct, IVariation, ProductFormData } from "@/types/productTypes";

type Props = {
  onClose: () => void;
  refreshProducts: () => void;
};

type Category = {
  _id: string;
  nombre: string;
};

export default function AddProductModal({ onClose, refreshProducts }: Props) {
  // Estado principal del formulario
  const [formData, setFormData] = useState<ProductFormData>({
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

  // Estados para gestión de categorías
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Estados para variaciones
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

  // Manejo de errores
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar categorías al abrir el modal
  // Cargar categorías con revalidación
  const fetchCategories = async () => {
    try {
      setIsLoadingCategories(true);
      const response = await fetch("/api/categorias", {
        cache: "no-store", // Evitar caché para obtener datos frescos
      });

      if (!response.ok) throw new Error("Error al cargar categorías");

      const data = await response.json();

      console.log("Categorías cargadas:", data);

      if (data.success) {
        setCategories(data.data);
        // Si hay una categoría seleccionada que ya no existe, la limpiamos
        if (
          formData.categoria &&
          !data.data.some((cat: Category) => cat._id === formData.categoria)
        ) {
          setFormData((prev) => ({ ...prev, categoria: "" }));
        }
      } else {
        throw new Error(data.error || "Error al procesar categorías");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors((prev) => ({
        ...prev,
        categories:
          error instanceof Error ? error.message : "Error al cargar categorías",
      }));
    } finally {
      setIsLoadingCategories(false);
    }
  };

  // Cargar categorías al abrir el modal
  useEffect(() => {
    fetchCategories();
  }, []);

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

    // Validación específica por tipo de producto
    if (!formData.tieneVariaciones) {
      if (formData.precio === undefined || formData.precio <= 0) {
        newErrors.precio = "Precio válido es requerido";
      }
      if (formData.stock === undefined || formData.stock < 0) {
        newErrors.stock = "Stock válido es requerido";
      }
    }

    if (formData.tieneVariaciones && formData.variaciones.length === 0) {
      newErrors.variaciones = "Debe agregar al menos una variación";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejo de cambios en el formulario
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

    // Limpiar error si existe
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Manejo de cambios en variaciones
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

  // Agregar nueva variación
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
      tieneVariaciones: true,
      variaciones: [
        ...prev.variaciones,
        {
          ...newVariation,
          codigo: codigoVariacion,
          activo: true,
          precio: Number(newVariation.precio),
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

  // Eliminar variación
  const removeVariation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variaciones: prev.variaciones.filter((_, i) => i !== index),
    }));
  };

  // Manejo de arrays (imágenes, especificaciones, características)
  type ArrayFields =
    | "imagenesGenerales"
    | "especificacionesTecnicas"
    | "caracteristicas";

  // Luego modifica tus funciones así:
  const handleArrayChange = (
    field: ArrayFields,
    index: number,
    value: string
  ) => {
    setFormData((prev) => {
      const newArray = [...prev[field]]; // Ya no necesita el type assertion
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayField = (field: ArrayFields) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field: ArrayFields, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  // Crear nueva categoría
  // Crear nueva categoría - Versión mejorada
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setErrors((prev) => ({
        ...prev,
        category: "El nombre de la categoría es requerido",
      }));
      return;
    }

    try {
      const response = await fetch("/api/categorias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: newCategoryName.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Actualizar el estado local y volver a cargar las categorías desde el servidor
        await fetchCategories();

        // Seleccionar la nueva categoría automáticamente
        setFormData((prev) => ({ ...prev, categoria: data.data._id }));
        setNewCategoryName("");
        setShowCategoryInput(false);
        setErrors((prev) => ({ ...prev, category: "" }));
      } else {
        throw new Error(data.error || "Error al crear categoría");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrors((prev) => ({
        ...prev,
        category:
          error instanceof Error ? error.message : "Error al crear categoría",
      }));
    }
  };

  // Eliminar categoría
  // Eliminar categoría - Versión mejorada
  const handleDeleteCategory = async (categoryId: string) => {
    if (
      !categoryId ||
      !window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")
    ) {
      return;
    }

    try {
      const response = await fetch("/api/categorias", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: categoryId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Actualizar el estado volviendo a cargar desde el servidor
        await fetchCategories();

        // Mostrar mensaje de éxito
        alert("Categoría eliminada correctamente");
      } else {
        throw new Error(data.error || "Error al eliminar categoría");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        error instanceof Error ? error.message : "Error al eliminar categoría"
      );
    }
  };

  // Envío del formulario
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
              precio: undefined,
              stock: undefined,
              stockMinimo: undefined,
              variaciones: formData.variaciones?.map((v) => ({
                ...v,
                precio: Number(v.precio) || 0,
                stock: Number(v.stock) || 0,
                stockMinimo: Number(v.stockMinimo) || 5,
              })),
            }
          : {
              variaciones: [],
              precio: Number(formData.precio) || undefined,
              stock: Number(formData.stock) || undefined,
              stockMinimo: Number(formData.stockMinimo) || 5,
            }),
      };

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

  // Clases CSS reutilizables
  const labelClass = "block font-semibold text-gray-700 mb-1";
  const inputClass =
    "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400";
  const errorClass = "text-red-500 text-sm mt-1";
  const buttonClass = "px-4 py-2 rounded transition-colors";
  const primaryButtonClass = `${buttonClass} bg-blue-600 text-white hover:bg-blue-700`;
  const secondaryButtonClass = `${buttonClass} bg-gray-200 text-gray-700 hover:bg-gray-300`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[1000px] max-w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">Agregar nuevo producto</h2>
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
              className={`${inputClass} ${
                errors.nombre ? "border-red-500" : ""
              }`}
              value={formData.nombre}
              onChange={handleChange}
              required
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
                }`}
                value={formData.categoria}
                onChange={handleChange}
                disabled={isLoadingCategories}
                required
              >
                <option value="">
                  {isLoadingCategories
                    ? "Cargando..."
                    : "Seleccione una categoría"}
                </option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.nombre}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setShowCategoryInput(!showCategoryInput)}
                className={secondaryButtonClass}
                disabled={isLoadingCategories}
              >
                {showCategoryInput ? "✕" : "+"}
              </button>
            </div>

            {errors.categoria && (
              <p className={errorClass}>{errors.categoria}</p>
            )}

            {showCategoryInput && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Nueva categoría"
                  className={inputClass}
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                />
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className={primaryButtonClass}
                  disabled={!newCategoryName.trim()}
                >
                  Agregar
                </button>
              </div>
            )}

            {errors.category && !showCategoryInput && (
              <p className={errorClass}>{errors.category}</p>
            )}
          </div>

          {/* Lista de categorías existentes - Versión mejorada */}
          <div className="col-span-2">
            <label className={labelClass}>Categorías disponibles:</label>
            {isLoadingCategories ? (
              <p className="text-gray-500 text-sm">Cargando categorías...</p>
            ) : (
              <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-sm py-1">
                    No hay categorías registradas
                  </p>
                ) : (
                  <ul className="divide-y">
                    {categories.map((category) => (
                      <li
                        key={category._id}
                        className="flex justify-between items-center py-2 px-1 hover:bg-gray-50"
                      >
                        <span className="truncate">{category.nombre}</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                categoria: category._id,
                              }))
                            }
                            className="text-xs text-blue-600 hover:text-blue-800"
                            title="Seleccionar esta categoría"
                          >
                            Seleccionar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(category._id)}
                            className="text-xs text-red-500 hover:text-red-700"
                            title="Eliminar categoría"
                          >
                            Eliminar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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
                    className="text-red-500 hover:text-red-700 px-2"
                    aria-label="Eliminar imagen"
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
                  required={!formData.tieneVariaciones}
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
                  required={!formData.tieneVariaciones}
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
              required
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
                    className={primaryButtonClass}
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
                    className="text-red-500 hover:text-red-700 px-2"
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
                    className="text-red-500 hover:text-red-700 px-2"
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
