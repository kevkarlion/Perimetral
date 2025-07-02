'use client'

import { IProduct, IVariation } from "@/lib/types/productTypes";

type Props = {
  product: IProduct
  onClose: () => void
}

export default function DetailsProductModal({ product, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[90vh] overflow-auto">
        {/* Header - Full width */}
        <div className="lg:col-span-3 flex justify-between items-start">
          <h2 className="text-2xl font-bold">Detalles del Producto</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Columna 1 - Información básica */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Información Básica</h3>
          <DetailItem label="Nombre" value={product.nombre} />
          <DetailItem label="Categoría" value={product.categoria} />
          <DetailItem label="Precio base" value={`${product.precio}`} />
          <DetailItem label="Stock" value={product.stock || 'N/A'} />
          <DetailItem label="Destacado" value={product.destacado ? '⭐ Sí' : 'No'} />
          
          <div>
            <h4 className="font-medium text-gray-600">Imágenes</h4>
            <p className="text-sm text-gray-900">
              {product.imagenes?.length || 0} principal(es)<br />
              {product.imagenesAdicionales?.length || 0} adicional(es)
            </p>
          </div>
        </div>

        {/* Columna 2 - Descripciones */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Descripciones</h3>
          <DetailItem 
            label="Corta" 
            value={product.descripcionCorta || 'No disponible'} 
            fullWidth
          />
          <DetailItem
            label="Larga"
            value={product.descripcionLarga || 'No disponible'}
            fullWidth
          />
        </div>

        {/* Columna 3 - Variaciones y características */}
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg border-b pb-2">Variaciones</h3>
            {product.variaciones && product.variaciones.length > 0 ? (
              <div className="space-y-2 mt-2">
                {product.variaciones.map((variacion: IVariation, index: number) => (
                  <div key={index} className="border rounded p-2 text-sm">
                    <p><span className="font-medium">Medida:</span> {variacion.medida}</p>
                    <p><span className="font-medium">Precio:</span> {variacion.precio}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mt-2">No hay variaciones</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg border-b pb-2">Especificaciones</h3>
            <ul className="list-disc pl-5 text-sm mt-2">
              {product.especificaciones?.length ? (
                product.especificaciones.map((esp, i) => <li key={i}>{esp}</li>)
              ) : <li className="text-gray-500">Ninguna</li>}
            </ul>
          </div>
        </div>

        {/* Footer - Full width */}
        <div className="lg:col-span-3 flex justify-end border-t pt-4">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente auxiliar para mostrar items de detalle
function DetailItem({ label, value, fullWidth = false }: { 
  label: string, 
  value: React.ReactNode, 
  fullWidth?: boolean 
}) {
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <p className="font-medium text-gray-600 text-sm">{label}</p>
      <p className="text-gray-900 text-sm">{value}</p>
    </div>
  )
}