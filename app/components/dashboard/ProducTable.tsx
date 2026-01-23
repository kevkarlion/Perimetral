'use client'

import { ProductFormData } from '@/types/ProductFormData'

interface ProductListProps {
  onEditProduct: (product: ProductFormData) => void
  onAddVariation: (productId: string) => void
}

export default function ProductTable({ onEditProduct, onAddVariation }: ProductListProps) {
  // Aquí deberías traer tus productos de tu store
  const products: ProductFormData[] = [
    { _id: '1', nombre: 'Alambre', codigoPrincipal: 'A01', categoria: '696f93d561a11755f6f1f0f1', descripcionCorta: 'Alambre galvanizado', activo: true, tieneVariaciones: true, proveedor: 'S/N', descripcionLarga: '', imagen: '' }
  ]

  return (
    <table className="min-w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2">Código</th>
          <th className="px-4 py-2">Nombre</th>
          <th className="px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p._id}>
            <td className="px-4 py-2">{p.codigoPrincipal}</td>
            <td className="px-4 py-2">{p.nombre}</td>
            <td className="px-4 py-2 space-x-2">
              <button onClick={() => onEditProduct(p)} className="text-blue-600 hover:underline">Editar</button>
              {p.tieneVariaciones && (
                <button onClick={() => onAddVariation(p._id!)} className="text-green-600 hover:underline">Agregar Variación</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
