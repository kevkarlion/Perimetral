'use client'
import { useState } from 'react'
import type { IVariation } from '@/types/productTypes'

type Props = {
  productId: string
  onClose: () => void
  initialVariations: IVariation[]
}

type ApiResponse = {
  success: boolean
  variations: IVariation[]
  error?: string
}

export default function AddVariationModal({ 
  productId, 
  onClose, 
  initialVariations 
}: Props) {
  const [variation, setVariation] = useState<Omit<IVariation, '_id' | 'codigo'>>({ 
    descripcion: '',
    medida: '',
    precio: 0,
    stock: 0,
    stockMinimo: 5,
    atributos: {
      longitud: 0,
      altura: 0,
      calibre: '',
      material: '',
      color: ''
    },
    imagenes: [],
    activo: true
  })

  const [variations, setVariations] = useState<IVariation[]>(initialVariations)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('general')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name.startsWith('atributos.')) {
      const attrName = name.split('.')[1] as keyof typeof variation.atributos
      setVariation(prev => ({
        ...prev,
        atributos: {
          ...prev.atributos,
          [attrName]: attrName === 'longitud' || attrName === 'altura' ? Number(value) : value
        }
      }))
    } else {
      setVariation(prev => ({ 
        ...prev, 
        [name]: name === 'descripcion' || name === 'medida' ? value : Number(value)
      }))
    }
  }

  const sendToStockRoute = async (action: string, payload: any) => {
    try {
      const url = `/api/stock?id=${productId}`;
      
      console.log('Enviando datos a la ruta desde AddVariationModal:', { 
        url,
        productId, 
        action, 
        payload 
      });

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          action,
          ...payload
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error en la respuesta del servidor: ${response.status} - ${errorText}`);
      }
      
      const result: ApiResponse = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Error al procesar la solicitud');
      }
      console.log('Respuesta del servidor en el modal:', result);
      
      console.log('Respuesta exitosa:', result);
      return result.variations;
    } catch (err) {
      console.error('Error en sendToStockRoute:', err);
      throw err;
    }
  }

  const addVariation = async () => {
    if (!variation.medida.trim()) {
      setError('La medida es requerida')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const newVariation: Omit<IVariation, '_id'> = {
        ...variation,
        medida: variation.medida.trim(),
        codigo: `${productId}-${variation.medida.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        activo: true
      }

      const updatedVariations = await sendToStockRoute('add-variation', {
        variation: newVariation
      })

      setVariations(updatedVariations)
      setVariation({ 
        descripcion: '',
        medida: '', 
        precio: 0, 
        stock: 0,
        stockMinimo: 5,
        atributos: {
          longitud: 0,
          altura: 0,
          calibre: '',
          material: '',
          color: ''
        },
        imagenes: [],
        activo: true
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar variación')
    } finally {
      setIsLoading(false)
    }
  }

  const removeVariation = async (index: number) => {
    const variationToRemove = variations[index]
    
    setIsLoading(true)
    setError('')

    try {
      const updatedVariations = await sendToStockRoute('remove-variation', {
        variationId: variationToRemove._id || variationToRemove.codigo
      })

      setVariations(updatedVariations)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar variación')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onClose()
  }

  const labelClass = "block font-semibold text-gray-700 mb-1"
  const inputClass = "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
  const sectionClass = "mb-6 p-4 border rounded-lg"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
      {/* Contenedor principal con tamaño fijo */}
      <div className="bg-white rounded-lg shadow-lg w-[800px] max-w-[95vw] h-[90vh] max-h-[90vh] flex flex-col">
        {/* Encabezado fijo */}
        <div className="flex justify-between items-start p-6 border-b">
          <h2 className="text-xl font-bold">Editar variaciones</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {/* Contenido desplazable */}
        <div className="overflow-y-auto flex-1 p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex border-b mb-4">
              <button
                type="button"
                className={`px-4 py-2 ${activeTab === 'general' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                General
              </button>
              <button
                type="button"
                className={`px-4 py-2 ${activeTab === 'atributos' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
                onClick={() => setActiveTab('atributos')}
              >
                Atributos
              </button>
              <button
                type="button"
                className={`px-4 py-2 ${activeTab === 'inventario' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
                onClick={() => setActiveTab('inventario')}
              >
                Inventario
              </button>
            </div>

            {/* Sección de contenido con altura fija */}
            <div className="min-h-[400px]">
              {activeTab === 'general' && (
                <div className={sectionClass}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="medida" className={labelClass}>Medida*</label>
                      <input
                        id="medida"
                        name="medida"
                        type="text"
                        placeholder="Ej: 2m"
                        className={inputClass}
                        value={variation.medida}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label htmlFor="precio" className={labelClass}>Precio*</label>
                      <input
                        id="precio"
                        name="precio"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="Ej: 1200"
                        className={inputClass}
                        value={variation.precio || ''}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="descripcion" className={labelClass}>Descripción</label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      placeholder="Descripción detallada de la variación"
                      className={inputClass}
                      rows={3}
                      value={variation.descripcion}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'atributos' && (
                <div className={sectionClass}>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="atributos.longitud" className={labelClass}>Longitud (cm)</label>
                      <input
                        id="atributos.longitud"
                        name="atributos.longitud"
                        type="number"
                        min="0"
                        className={inputClass}
                        value={variation.atributos?.longitud}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label htmlFor="atributos.altura" className={labelClass}>Altura (cm)</label>
                      <input
                        id="atributos.altura"
                        name="atributos.altura"
                        type="number"
                        min="0"
                        className={inputClass}
                        value={variation.atributos?.altura}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="atributos.calibre" className={labelClass}>Calibre</label>
                      <input
                        id="atributos.calibre"
                        name="atributos.calibre"
                        type="text"
                        className={inputClass}
                        value={variation.atributos?.calibre}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label htmlFor="atributos.material" className={labelClass}>Material</label>
                      <input
                        id="atributos.material"
                        name="atributos.material"
                        type="text"
                        className={inputClass}
                        value={variation.atributos?.material}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label htmlFor="atributos.color" className={labelClass}>Color</label>
                      <input
                        id="atributos.color"
                        name="atributos.color"
                        type="text"
                        className={inputClass}
                        value={variation.atributos?.color}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'inventario' && (
                <div className={sectionClass}>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="stock" className={labelClass}>Stock</label>
                      <input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        className={inputClass}
                        value={variation.stock}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label htmlFor="stockMinimo" className={labelClass}>Stock Mínimo</label>
                      <input
                        id="stockMinimo"
                        name="stockMinimo"
                        type="number"
                        min="0"
                        className={inputClass}
                        value={variation.stockMinimo}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="activo"
                          checked={variation.activo}
                          onChange={(e) => setVariation(prev => ({ ...prev, activo: e.target.checked }))}
                          className="mr-2"
                          disabled={isLoading}
                        />
                        <span className={labelClass}>Activo</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <button
                type="button"
                onClick={addVariation}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={isLoading || !variation.medida.trim() || variation.precio <= 0}
              >
                {isLoading ? 'Agregando...' : 'Agregar variación'}
              </button>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Variaciones actuales</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
                {variations.length > 0 ? (
                  variations.map((v, index) => (
                    <div
                      key={`${v._id || v.codigo}-${index}`}
                      className="flex justify-between items-center border-b pb-2 last:border-b-0"
                    >
                      <div>
                        <span className="font-medium">{v.medida}</span> - ${v.precio.toFixed(2)}
                        {v.atributos?.material && (
                          <span className="text-sm text-gray-500 ml-2">({v.atributos.material})</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVariation(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                        disabled={isLoading}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm py-2">No hay variaciones agregadas</p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer fijo */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              disabled={isLoading || variations.length === 0}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              ) : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}