// components/CategoryManager.tsx
"use client";

import { useState, useEffect } from "react";

export interface Category {
  _id: string;
  nombre: string;
}

interface CategoryManagerProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  error?: string;
}

export default function CategoryManager({ 
  selectedCategory, 
  onCategoryChange, 
  error 
}: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/categorias", {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Error al cargar categorías");

      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
        // Si la categoría seleccionada ya no existe, limpiar
        if (selectedCategory && !data.data.some((cat: Category) => cat._id === selectedCategory)) {
          onCategoryChange("");
        }
      } else {
        throw new Error(data.error || "Error al procesar categorías");
      }
    } catch (error) {
      console.error("Error:", error);
      setCategoryError(error instanceof Error ? error.message : "Error al cargar categorías");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setCategoryError("El nombre de la categoría es requerido");
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
        await fetchCategories();
        onCategoryChange(data.data._id);
        setNewCategoryName("");
        setShowCategoryInput(false);
        setCategoryError("");
      } else {
        throw new Error(data.error || "Error al crear categoría");
      }
    } catch (error) {
      console.error("Error:", error);
      setCategoryError(error instanceof Error ? error.message : "Error al crear categoría");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!categoryId || !window.confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
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
        await fetchCategories();
        alert("Categoría eliminada correctamente");
      } else {
        throw new Error(data.error || "Error al eliminar categoría");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Error al eliminar categoría");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const labelClass = "block font-semibold text-gray-700 mb-1";
  const inputClass = "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400";
  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="categoria" className={labelClass}>
          Categoría <span className="text-red-600">*</span>
        </label>

        <div className="flex gap-2">
          <select
            id="categoria"
            name="categoria"
            className={`${inputClass} ${error ? "border-red-500" : ""}`}
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={isLoading}
            required
          >
            <option value="">
              {isLoading ? "Cargando..." : "Seleccione una categoría"}
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
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            disabled={isLoading}
          >
            {showCategoryInput ? "✕" : "+"}
          </button>
        </div>

        {error && <p className={errorClass}>{error}</p>}

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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              disabled={!newCategoryName.trim()}
            >
              Agregar
            </button>
          </div>
        )}

        {categoryError && !showCategoryInput && (
          <p className={errorClass}>{categoryError}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Categorías disponibles:</label>
        {isLoading ? (
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
                        onClick={() => onCategoryChange(category._id)}
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
    </div>
  );
}