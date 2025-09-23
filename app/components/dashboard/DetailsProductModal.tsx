"use client";

import { IProduct } from "@/types/productTypes";

interface DetailsProductModalProps {
  product: IProduct;
  onClose: () => void;
}

export default function DetailsProductModal({
  product,
  onClose,
}: DetailsProductModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>

        {/* Información del producto */}
        <h2 className="text-xl font-bold mb-2">{product.nombre}</h2>
        <p className="text-sm text-gray-600">{product.descripcionLarga}</p>

        {/* Categoria */}
        {product.categoria &&
          typeof product.categoria !== "string" &&
          "_id" in product.categoria &&
          "nombre" in product.categoria && (
            <p className="text-xs text-gray-500 mt-1">
              Categoría: {product.categoria.nombre}
            </p>
          )}

        {/* Precio y stock */}
        {!product.tieneVariaciones && (
          <div className="mt-4">
            <p className="font-semibold">Precio: ${product.precio}</p>
            <p className="text-sm text-gray-600">Stock: {product.stock}</p>
          </div>
        )}

        {/* Variaciones */}
        {product.tieneVariaciones && product.variaciones && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Variaciones:</h3>
            <ul className="space-y-2">
              {product.variaciones.map((v) => (
                <li
                  key={v._id?.toString()}
                  className="p-3 border rounded-md bg-gray-50"
                >
                  <p className="font-medium">{v.nombre}</p>
                  <p className="text-sm text-gray-600">
                    Código: {v.codigo} | Precio: ${v.precio} | Stock: {v.stock}
                  </p>

                  {/* Imágenes de la variación */}
                  <div className="flex gap-2 mt-2">
                    {v.imagenes.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={v.nombre || "variación"}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Especificaciones */}
        {product.especificacionesTecnicas?.length ? (
          <div className="mt-4">
            <h3 className="font-semibold">Especificaciones:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {product.especificacionesTecnicas.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Características */}
        {product.caracteristicas?.length ? (
          <div className="mt-4">
            <h3 className="font-semibold">Características:</h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {product.caracteristicas.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
