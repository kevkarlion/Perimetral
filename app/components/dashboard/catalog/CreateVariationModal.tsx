"use client";

import { useState } from "react";
import CloudinaryUploader from "@/app/components/CloudinaryUploader";
import { IVariationAttribute } from "@/types/variation.frontend";

// Tipo de producto frontend (mínimo necesario)
interface IProductRef {
  _id: string;
  nombre: string;
}

interface Props {
  product: IProductRef;
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateVariationModal({
  product,
  isOpen,
  onClose,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [medida, setMedida] = useState("");
  const [uMedida, setUMedida] = useState("");
  const [precio, setPrecio] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [atributos, setAtributos] = useState<IVariationAttribute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // --------------------
  // ATRIBUTOS
  // --------------------
  const handleAddAttribute = () =>
    setAtributos((prev) => [...prev, { nombre: "", valor: "" }]);

  const handleChangeAttribute = (
    index: number,
    field: keyof IVariationAttribute,
    value: string,
  ) => {
    const newAttrs = [...atributos];
    newAttrs[index][field] = value;
    setAtributos(newAttrs);
  };

  const handleRemoveAttribute = (index: number) =>
    setAtributos((prev) => prev.filter((_, i) => i !== index));

  // --------------------
  // IMÁGENES
  // --------------------
  const handleRemoveImage = (url: string) => {
    setImagenes((prev) => prev.filter((i) => i !== url));
  };

  // --------------------
  // GUARDAR
  // --------------------
  const handleSave = async () => {
    if (!nombre || precio < 0 || stock < 0 || imagenes.length === 0) {
      setError("Completa todos los campos obligatorios");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/variations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product._id,
          nombre,
          descripcion,
          medida,
          uMedida,
          precio,
          stock,
          imagenes,
          atributos: atributos.filter((a) => a.nombre && a.valor),
        }),
      });

      if (!res.ok) throw new Error();

      onClose();
    } catch {
      setError("Error creando variación");
    } finally {
      setLoading(false);
    }
  };

  // --------------------
  // UI
  // --------------------
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-[80]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            Nueva variación
          </h2>
          <p className="text-sm text-gray-500">
            Producto: <span className="font-medium">{product.nombre}</span>
          </p>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombre *">
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="field"
              />
            </Field>

            <Field label="Precio *">
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(Number(e.target.value))}
                className="field"
              />
            </Field>

            <Field label="Stock *">
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="field"
              />
            </Field>

            <Field label="Medida">
              <input
                value={medida}
                onChange={(e) => setMedida(e.target.value)}
                className="field"
              />
            </Field>

            <Field label="Unidad">
              <input
                value={uMedida}
                onChange={(e) => setUMedida(e.target.value)}
                className="field"
              />
            </Field>
          </div>

          <Field label="Descripción">
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="field resize-none h-24"
            />
          </Field>

          {/* CLOUDINARY */}
          <Field label="Imágenes *">
            <CloudinaryUploader
              existingImages={imagenes}
              onImageUpload={(url) =>
                setImagenes((prev) => [...prev, url])
              }
              folder="variations"
            />

            {imagenes.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {imagenes.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      alt={`Imagen ${idx + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          {/* ATRIBUTOS */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Atributos</span>
              <button
                type="button"
                onClick={handleAddAttribute}
                className="text-indigo-600 text-sm hover:underline"
              >
                + Agregar
              </button>
            </div>

            {atributos.map((attr, i) => (
              <div key={i} className="flex gap-2">
                <input
                  placeholder="Nombre"
                  value={attr.nombre}
                  onChange={(e) =>
                    handleChangeAttribute(i, "nombre", e.target.value)
                  }
                  className="field flex-1"
                />
                <input
                  placeholder="Valor"
                  value={attr.valor}
                  onChange={(e) =>
                    handleChangeAttribute(i, "valor", e.target.value)
                  }
                  className="field flex-1"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAttribute(i)}
                  className="text-red-500 font-bold px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Crear variación"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --------------------------------

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
}
