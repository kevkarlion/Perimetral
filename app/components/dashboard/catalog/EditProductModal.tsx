"use client";

import { useState } from "react";
import CloudinaryUploader from "@/app/components/CloudinaryUploader";
import { IProductBase } from "@/types/product.frontend";

interface Props {
  product: IProductBase & {
    codigoPrincipal?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProductModal({
  product,
  isOpen,
  onClose,
}: Props) {
  const [nombre, setNombre] = useState(product.nombre);
  const [descripcionCorta, setDescripcionCorta] = useState(
    product.descripcionCorta || ""
  );
  const [descripcionLarga, setDescripcionLarga] = useState(
    product.descripcionLarga || ""
  );
  const [proveedor, setProveedor] = useState(product.proveedor || "");
  const [imagenes, setImagenes] = useState<string[]>(
    product.imagenes || []
  );
  const [activo, setActivo] = useState(product.activo ?? true);
  const [destacado, setDestacado] = useState(
    product.destacado ?? false
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRemoveImage = (url: string) =>
    setImagenes((prev) => prev.filter((i) => i !== url));

  // --------------------
  // SAVE REAL
  // --------------------
  const saveProduct = async () => {
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          descripcionCorta,
          descripcionLarga,
          proveedor,
          imagenes,
          activo,
          destacado,
        }),
      });

      if (!res.ok) throw new Error();

      setSuccess(true);

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch {
      setError("No se pudo guardar el producto");
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  // --------------------
  // UI
  // --------------------
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-[80]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative overflow-hidden">
        {/* TOAST SUCCESS */}
        {success && (
          <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-xl shadow animate-fade-in">
            Producto editado correctamente ✔
          </div>
        )}

        {/* HEADER */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            Editar producto
          </h2>
          {product.codigoPrincipal && (
            <p className="text-sm text-gray-500">
              {product.codigoPrincipal}
            </p>
          )}
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <Field label="Nombre">
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="field"
            />
          </Field>

          <Field label="Descripción corta">
            <textarea
              value={descripcionCorta}
              onChange={(e) =>
                setDescripcionCorta(e.target.value)
              }
              className="field"
            />
          </Field>

          <Field label="Descripción larga">
            <textarea
              value={descripcionLarga}
              onChange={(e) =>
                setDescripcionLarga(e.target.value)
              }
              className="field"
            />
          </Field>

          <Field label="Proveedor">
            <input
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              className="field"
            />
          </Field>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-black">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) =>
                  setActivo(e.target.checked)
                }
              />
              Activo
            </label>

            <label className="flex items-center gap-2 text-black">
              <input
                type="checkbox"
                checked={destacado}
                onChange={(e) =>
                  setDestacado(e.target.checked)
                }
              />
              Destacado
            </label>
          </div>

          <Field label="Imágenes">
            <CloudinaryUploader
              existingImages={imagenes}
              onImageUpload={(url) =>
                setImagenes((prev) => [...prev, url])
              }
              folder="products"
            />

            {imagenes.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {imagenes.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      onClick={() => handleRemoveImage(img)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="border px-4 py-2 text-black"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={loading}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
          >
            Guardar
          </button>
        </div>

        {/* CONFIRM MODAL */}
        {showConfirm && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 shadow-xl w-[320px] text-center space-y-4 animate-scale-in">
              <h3 className="font-semibold text-lg text-black">
                ¿Guardar cambios?
              </h3>
              <p className="text-sm text-gray-500">
                Se actualizará la información del producto.
              </p>

              <div className="flex justify-center gap-3 text-black">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="border px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveProduct}
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Sí, guardar
                </button>
              </div>
            </div>
          </div>
        )}
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
      <label className="text-xs text-gray-600">
        {label}
      </label>
      {children}
    </div>
  );
}
