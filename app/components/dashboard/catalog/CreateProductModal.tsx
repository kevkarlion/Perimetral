"use client";

import { useState } from "react";
import { ICategory } from "@/app/components/store/category-store";
import CloudinaryUploader from "@/app/components/CloudinaryUploader";

interface CreateProductModalProps {
  isOpen: boolean;
  category: ICategory;
  onClose: () => void;
}

export default function CreateProductModal({
  isOpen,
  category,
  onClose,
}: CreateProductModalProps) {
  const [codigoPrincipal, setCodigoPrincipal] = useState("");
  const [nombre, setNombre] = useState("");
  const [slug, setSlug] = useState("");
  const [descripcionCorta, setDescripcionCorta] = useState("");
  const [descripcionLarga, setDescripcionLarga] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [destacado, setDestacado] = useState(false);
  const [activo, setActivo] = useState(true);

  // 👇 IMÁGENES CLOUDINARY
  const [imagenes, setImagenes] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRemoveImage = (url: string) => {
    setImagenes(imagenes.filter((i) => i !== url));
  };

  const handleSave = async () => {
    if (!codigoPrincipal || !nombre || imagenes.length === 0) {
      setError("Código, nombre e imágenes son obligatorios");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          codigoPrincipal,
          nombre,
          slug,
          categoria: category._id,
          descripcionCorta,
          descripcionLarga,
          proveedor,
          destacado,
          activo,
          imagenes, // 👈 ya vienen de Cloudinary
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) throw new Error();

      onClose();
    } catch {
      setError("Error creando producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-[80]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            Nuevo producto
          </h2>
          <p className="text-sm text-gray-500">
            Categoría: <span className="font-medium">{category.nombre}</span>
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
            <Field label="Código *">
              <input
                value={codigoPrincipal}
                onChange={(e) => setCodigoPrincipal(e.target.value)}
                className="field"
              />
            </Field>

            <Field label="Nombre *">
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="field"
              />
            </Field>

            <Field label="Slug">
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
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
          </div>

          <Field label="Descripción corta">
            <textarea
              value={descripcionCorta}
              onChange={(e) => setDescripcionCorta(e.target.value)}
              className="field resize-none h-20"
            />
          </Field>

          <Field label="Descripción larga">
            <textarea
              value={descripcionLarga}
              onChange={(e) => setDescripcionLarga(e.target.value)}
              className="field resize-none h-24"
            />
          </Field>

          {/* CLOUDINARY */}
          <Field label="Imágenes *">
            <CloudinaryUploader
              existingImages={imagenes}
              onImageUpload={(url) => setImagenes((prev) => [...prev, url])}
              folder="products"
            />

            {imagenes.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-2">
                {imagenes.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={img}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-80 hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={destacado}
                onChange={(e) => setDestacado(e.target.checked)}
              />
              Destacado
            </label>

            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />
              Activo
            </label>
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
            {loading ? "Guardando..." : "Crear producto"}
          </button>
        </div>
      </div>
    </div>
  );
}

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
