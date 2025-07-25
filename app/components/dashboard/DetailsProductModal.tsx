'use client'

import { IProduct, IVariation } from "@/types/productTypes";

type Props = {
  product: IProduct;
  onClose: () => void;
};

export default function DetailsProductModal({ product, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-h-[90vh] overflow-auto">
        {/* Header */}
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
          <DetailItem 
            label="Precio base" 
            value={product.precio ? `$${product.precio.toFixed(2)}` : 'N/A'} 
          />
          <DetailItem 
            label="Stock total" 
            value={product.stock !== undefined ? product.stock : 'N/A'} 
          />
        </div>

        {/* Columna 2 - Descripciones */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Descripciones</h3>
          <DetailItem 
            label="Descripción Corta" 
            value={product.descripcionCorta || 'No disponible'} 
            fullWidth
          />
          <DetailItem
            label="Descripción Larga"
            value={product.descripcionLarga || 'No disponible'}
            fullWidth
          />
        </div>

        {/* Columna 3 - Variaciones */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">
            {product.tieneVariaciones ? 'Variaciones' : 'Sin Variaciones'}
          </h3>
          {product.tieneVariaciones && product.variaciones?.length > 0 ? (
            <div className="space-y-3 mt-2">
              {product.variaciones.map((variacion) => (
                <div key={variacion.codigo} className="border rounded-lg p-3 text-sm bg-gray-50">
                  <div className="grid grid-cols-2 gap-2">
                    <DetailItemSmall label="Medida" value={variacion.medida} />
                    <DetailItemSmall 
                      label="Precio" 
                      value={`$${variacion.precio.toFixed(2)}`} 
                    />
                    <DetailItemSmall 
                      label="Stock" 
                      value={
                        <span className={variacion.stock <= 0 ? 'text-red-500 font-medium' : ''}>
                          {variacion.stock}
                        </span>
                      } 
                    />
                  </div>
                  
                  {variacion.descripcion && (
                    <p className="text-gray-600 text-sm mt-2">
                      <span className="font-medium">Notas:</span> {variacion.descripcion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm mt-2">Este producto no tiene variaciones</p>
          )}
        </div>

        {/* Footer */}
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
  );
}

// Componente auxiliar para mostrar items de detalle
function DetailItem({ label, value, fullWidth = false }: { 
  label: string; 
  value: React.ReactNode; 
  fullWidth?: boolean; 
}) {
  return (
    <div className={fullWidth ? 'col-span-2' : ''}>
      <p className="font-medium text-gray-600 text-sm">{label}</p>
      <p className="text-gray-900 text-sm">{value}</p>
    </div>
  );
}

// Componente auxiliar para items pequeños en variaciones
function DetailItemSmall({ label, value }: { 
  label: string; 
  value: React.ReactNode; 
}) {
  return (
    <div>
      <p className="font-medium text-gray-600 text-xs">{label}</p>
      <p className="text-gray-900 text-sm">{value}</p>
    </div>
  );
}