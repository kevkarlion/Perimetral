import { useState } from 'react'

type Props = {
  onClose: () => void
}

export default function AddProductModal({ onClose }: Props) {
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    descripcionCorta: '',
    descripcionLarga: '',
    categoria: '',
    imagen: '',
    imagenes: [''],
    imagenesAdicionales: [''],
    precio: '',
    tieneVariaciones: false,
    destacado: false,
    especificaciones: [''],
    caracteristicas: [''],
    stock: 0,
    stockMinimo: 0,
    variaciones: []
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const finalValue =
      type === 'checkbox' && e.target instanceof HTMLInputElement
        ? e.target.checked
        : value
    setFormData({ ...formData, [name]: finalValue })
  }

  const labelClass = "block font-semibold text-gray-700"
  const inputClass =
    "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-[1000px] max-w-full p-8">
        <h2 className="text-2xl font-bold mb-6">Agregar nuevo producto</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            console.log('Nuevo producto:', formData)
            onClose()
          }}
          className="grid grid-cols-4 gap-x-8 gap-y-6"
        >
          {/* ID */}
          <div>
            <label htmlFor="id" className={labelClass}>
              ID <span className="text-red-600">*</span>
            </label>
            <input
              id="id"
              type="text"
              name="id"
              placeholder="ID único"
              className={inputClass}
              value={formData.id}
              onChange={handleChange}
              required
            />
          </div>

          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className={labelClass}>
              Nombre <span className="text-red-600">*</span>
            </label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              placeholder="Nombre"
              className={inputClass}
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Descripción corta */}
          <div>
            <label htmlFor="descripcionCorta" className={labelClass}>
              Descripción corta <span className="text-red-600">*</span>
            </label>
            <input
              id="descripcionCorta"
              type="text"
              name="descripcionCorta"
              placeholder="Resumen breve"
              className={inputClass}
              value={formData.descripcionCorta}
              onChange={handleChange}
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <label htmlFor="categoria" className={labelClass}>
              Categoría <span className="text-red-600">*</span>
            </label>
            <input
              id="categoria"
              type="text"
              name="categoria"
              placeholder="Categoría"
              className={inputClass}
              value={formData.categoria}
              onChange={handleChange}
              required
            />
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="precio" className={labelClass}>
              Precio <span className="text-red-600">*</span>
            </label>
            <input
              id="precio"
              type="text"
              name="precio"
              placeholder="Precio base"
              className={inputClass}
              value={formData.precio}
              onChange={handleChange}
              required
            />
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className={labelClass}>
              Stock <span className="text-red-600">*</span>
            </label>
            <input
              id="stock"
              type="number"
              name="stock"
              placeholder="Cantidad en stock"
              className={inputClass}
              min={0}
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          {/* Stock mínimo */}
          <div>
            <label htmlFor="stockMinimo" className={labelClass}>
              Stock mínimo <span className="text-red-600">*</span>
            </label>
            <input
              id="stockMinimo"
              type="number"
              name="stockMinimo"
              placeholder="Stock mínimo"
              className={inputClass}
              min={0}
              value={formData.stockMinimo}
              onChange={handleChange}
              required
            />
          </div>

          {/* Imagen */}
          <div>
            <label htmlFor="imagen" className={labelClass}>
              Imagen (URL)
            </label>
            <input
              id="imagen"
              type="text"
              name="imagen"
              placeholder="URL imagen"
              className={inputClass}
              value={formData.imagen}
              onChange={handleChange}
            />
          </div>

          {/* Tiene variaciones */}
          <div className="flex items-center gap-2 mt-6">
            <input
              id="tieneVariaciones"
              type="checkbox"
              name="tieneVariaciones"
              checked={formData.tieneVariaciones}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label htmlFor="tieneVariaciones" className="select-none font-semibold text-gray-700">
              ¿Tiene variaciones?
            </label>
          </div>

          {/* Destacado */}
          <div className="flex items-center gap-2 mt-6">
            <input
              id="destacado"
              type="checkbox"
              name="destacado"
              checked={formData.destacado}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <label htmlFor="destacado" className="select-none font-semibold text-gray-700">
              ¿Destacado?
            </label>
          </div>

          {/* Descripción larga */}
          <div className="col-span-4">
            <label htmlFor="descripcionLarga" className={labelClass}>
              Descripción larga <span className="text-red-600">*</span>
            </label>
            <textarea
              id="descripcionLarga"
              name="descripcionLarga"
              placeholder="Descripción detallada"
              className={`${inputClass} resize-y h-24`}
              value={formData.descripcionLarga}
              onChange={handleChange}
              required
            />
          </div>

          {/* Botones */}
          <div className="col-span-4 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Guardar producto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
