"use client"

import { useState } from "react"
import CloudinaryUploader from "@/app/components/CloudinaryUploader"
import { IVariationAttribute, IVariation } from "@/types/variation.frontend"

interface Props {
  variation: IVariation
  isOpen: boolean
  onClose: () => void
}

export default function EditVariationModal({
  variation,
  isOpen,
  onClose,
}: Props) {
  const [nombre, setNombre] = useState(variation.nombre)
  const [descripcion, setDescripcion] = useState(variation.descripcion || "")
  const [medida, setMedida] = useState(variation.medida || "")
  const [uMedida, setUMedida] = useState(variation.uMedida || "")
  const [precio, setPrecio] = useState(variation.precio)
  const [stock, setStock] = useState(variation.stock)
  const [descuento, setDescuento] = useState(variation.descuento || "")
  const [imagenes, setImagenes] = useState<string[]>(variation.imagenes || [])
  const [atributos, setAtributos] = useState<IVariationAttribute[]>(
    variation.atributos || [],
  )
  const [activo, setActivo] = useState(variation.activo ?? true)
  const [destacada, setDestacada] = useState(variation.destacada ?? false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  // --------------------
  // ATRIBUTOS
  // --------------------
  const handleAddAttribute = () =>
    setAtributos((prev) => [...prev, { nombre: "", valor: "" }])

  const handleChangeAttribute = (
    index: number,
    field: keyof IVariationAttribute,
    value: string,
  ) => {
    const copy = [...atributos]
    copy[index][field] = value
    setAtributos(copy)
  }

  const handleRemoveAttribute = (index: number) =>
    setAtributos((prev) => prev.filter((_, i) => i !== index))

  const handleRemoveImage = (url: string) =>
    setImagenes((prev) => prev.filter((i) => i !== url))

  // --------------------
  // SAVE REAL
  // --------------------
  const saveVariation = async () => {
    if (!nombre.trim() || precio < 0 || stock < 0 || imagenes.length === 0) {
      setError("Campos obligatorios incompletos")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/variations/${variation._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          descripcion,
          medida,
          uMedida,
          precio,
          stock,
          descuento, // 👈 nuevo campo
          imagenes,
          activo,
          destacada,
          atributos: atributos.filter((a) => a.nombre && a.valor),
        }),
      })

      if (!res.ok) throw new Error()

      setSuccess(true)
      setTimeout(() => onClose(), 2000)
    } catch {
      setError("No se pudo guardar la variación")
    } finally {
      setLoading(false)
      setShowConfirm(false)
    }
  }

  // --------------------
  // UI
  // --------------------
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-[80]">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative overflow-hidden">

        {/* TOAST */}
        {success && (
          <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-xl shadow animate-fade-in">
            Variación editada correctamente ✔
          </div>
        )}

        {/* HEADER */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">
            Editar variación
          </h2>
          <p className="text-sm text-gray-500">{variation.codigo}</p>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded">
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

            <Field label="Descuento">
              <input
                value={descuento}
                onChange={(e) => setDescuento(e.target.value)}
                className="field"
                placeholder="Ej: 10% | 2x1 | OFF"
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

          {/* FLAGS */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-black">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />
              Activa
            </label>

            <label className="flex items-center gap-2 text-black">
              <input
                type="checkbox"
                checked={destacada}
                onChange={(e) => setDestacada(e.target.checked)}
              />
              Destacada
            </label>
          </div>

          {/* IMÁGENES */}
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

          {/* ATRIBUTOS */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Atributos</span>
              <button
                onClick={handleAddAttribute}
                className="text-indigo-600 text-sm"
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
                Se actualizará la variación.
              </p>

              <div className="flex justify-center gap-3 text-black">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="border px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveVariation}
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
  )
}

// --------------------------------

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-600">{label}</label>
      {children}
    </div>
  )
}
