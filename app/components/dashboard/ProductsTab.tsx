'use client'

import { useState } from 'react'
import ProductList from './catalog/ProductList'
import VariationForm from './catalog/VariationForm'
import { ProductFormData, IVariation } from '@/types/ProductFormData'

export default function ProductsTab() {
  const [openVariationForm, setOpenVariationForm] = useState(false)
  const [currentProductId, setCurrentProductId] = useState<string | null>(null)

  const handleAddVariation = (productId: string) => {
    setCurrentProductId(productId)
    setOpenVariationForm(true)
  }

  const handleSubmitVariation = (data: IVariation) => {
    console.log('Variación guardada:', data)
    setOpenVariationForm(false)
  }

  const products: ProductFormData[] = [
    {
      _id: '1',
      nombre: 'Alambre',
      codigoPrincipal: 'A01',
      categoria: '696f93d561a11755f6f1f0f1',
      descripcionCorta: 'Alambre galvanizado',
      activo: true,
      tieneVariaciones: true,
      proveedor: 'S/N',
      descripcionLarga: '',
      imagen: '',
    },
  ]

  return (
    <div className="space-y-6">
      <ProductList
        products={products}
        onEditProduct={(product) => console.log('Editar producto:', product)}
        onAddVariation={handleAddVariation}
      />

      {openVariationForm && currentProductId && (
        <VariationForm
          productId={currentProductId}
          onSubmit={handleSubmitVariation}
          onClose={() => setOpenVariationForm(false)}
          type="new"
        />
      )}
    </div>
  )
}
