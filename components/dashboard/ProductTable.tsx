'use client'

import { useState } from 'react'
import AddProductModal from './AddProductModal'
import AddVariationModal from './AddVariationModal'

type Variation = {
  medida: string
  precio: string
}

type Product = {
  id: string
  nombre: string
  categoria: string
  variaciones: Variation[]
  stock: number
  destacado: boolean
  precio: number
}

export default function ProductTable() {
  const [showModal, setShowModal] = useState(false)
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      nombre: 'Poste de arranque',
      categoria: 'Postes',
      variaciones: [
        { medida: '2m', precio: '5200' },
        { medida: '2.5m', precio: '5800' }
      ],
      stock: 15,
      destacado: true,
      precio: 5200
    }
  ])

  const [showVariationModal, setShowVariationModal] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)

  const openAddProductModal = () => setShowModal(true)
  const closeAddProductModal = () => setShowModal(false)

  const openVariationModal = (product: Product) => {
    setCurrentProduct(product)
    setShowVariationModal(true)
  }

  const closeVariationModal = () => {
    setCurrentProduct(null)
    setShowVariationModal(false)
  }

  const updateProductVariations = (updatedVariations: Variation[]) => {
    if (!currentProduct) return

    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === currentProduct.id ? { ...p, variaciones: updatedVariations } : p
      )
    )

    closeVariationModal()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Productos</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={openAddProductModal}
        >
          + Nuevo Producto
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-sm">
            <th className="p-2">Nombre</th>
            <th className="p-2">Categoría</th>
            <th className="p-2">Variaciones</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Destacado</th>
            <th className="p-2">Precio base</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id} className="border-t text-sm align-top">
              <td className="p-2">{prod.nombre}</td>
              <td className="p-2">{prod.categoria}</td>
              <td className="p-2">
                <div className="flex flex-col gap-1">
                  {prod.variaciones.map((v, i) => (
                    <div key={i}>
                      {v.medida} - ${v.precio}
                    </div>
                  ))}
                </div>
              </td>
              <td className="p-2">{prod.stock}</td>
              <td className="p-2">{prod.destacado ? '⭐' : '—'}</td>
              <td className="p-2">${prod.precio}</td>
              <td className="p-2">
                <button
                  className="text-sm text-blue-500 hover:underline"
                  onClick={() => openVariationModal(prod)}
                >
                  + Medida
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && <AddProductModal onClose={closeAddProductModal} />}

      {showVariationModal && currentProduct && (
        <AddVariationModal
          initialVariations={currentProduct.variaciones}
          onClose={closeVariationModal}
          onUpdateVariations={updateProductVariations}
        />
      )}
    </div>
  )
}
