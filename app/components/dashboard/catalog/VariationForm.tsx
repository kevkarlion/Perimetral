// 'use client'

// import { useState } from 'react'
// import { VariationFormProps, IVariation } from '@/types/ProductFormData'

// export default function VariationForm({
//   productId,
//   initialData,
//   onSubmit,
//   onClose,
//   type,
// }: VariationFormProps) {
//   const [formData, setFormData] = useState<IVariation>({
//     nombre: '',
//     precio: 0,
//     activo: true,
//     imagenes: [],
//     ...initialData,
//   })

//   const handleFieldChange = (field: keyof IVariation, value: any) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     onSubmit(formData)
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-gray-50">
//       <h3 className="font-semibold">Variación del producto {productId}</h3>

//       <div>
//         <label className="block font-semibold mb-1">Nombre</label>
//         <input
//           type="text"
//           value={formData.nombre}
//           onChange={(e) => handleFieldChange('nombre', e.target.value)}
//           className="border p-2 rounded w-full"
//         />
//       </div>

//       <div>
//         <label className="block font-semibold mb-1">Precio</label>
//         <input
//           type="number"
//           value={formData.precio}
//           onChange={(e) => handleFieldChange('precio', Number(e.target.value))}
//           className="border p-2 rounded w-full"
//         />
//       </div>

//       <div className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           checked={formData.activo}
//           onChange={(e) => handleFieldChange('activo', e.target.checked)}
//         />
//         <label>Activo</label>
//       </div>

//       <div className="flex gap-2">
//         <button
//           type="submit"
//           className="bg-brand text-white px-4 py-2 rounded hover:bg-brandHover transition-colors"
//         >
//           Guardar
//         </button>
//         {onClose && (
//           <button
//             type="button"
//             onClick={onClose}
//             className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
//           >
//             Cancelar
//           </button>
//         )}
//       </div>
//     </form>
//   )
// }
