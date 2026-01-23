"use client";

import { IVariation } from "@/types/ProductFormData";

interface VariationListProps {
  variations: IVariation[];
  onEditVariation: (variation: IVariation) => void;
  onDeleteVariation?: (variationId: string | undefined) => void;
}

export default function VariationList({
  variations,
  onEditVariation,
  onDeleteVariation,
}: VariationListProps) {
  if (!variations || variations.length === 0) {
    return (
      <p className="text-gray-500 mt-4">Este producto no tiene variaciones.</p>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Variaciones</h3>

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Precio</th>
            <th className="px-4 py-2 text-left">Activo</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {variations.map((v) => (
            <tr key={v._id}>
              <td className="px-4 py-2">{v.nombre}</td>
              <td className="px-4 py-2">{v.precio ? `$${v.precio}` : "-"}</td>
              <td className="px-4 py-2">{v.activo ? "Sí" : "No"}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => onEditVariation(v)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>

                {onDeleteVariation && v._id && (
                  <button
                    onClick={() => onDeleteVariation(v._id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
