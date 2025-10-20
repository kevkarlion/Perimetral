// // components/ProductSpecifications.tsx
// "use client";

// import { ProductFormData } from "@/types/productTypes";

// interface ProductSpecificationsProps {
//   formData: ProductFormData;
//   onFieldChange: (field: keyof ProductFormData, value: any) => void;
// }

// export default function ProductSpecifications({
//   formData,
//   onFieldChange
// }: ProductSpecificationsProps) {
//   const handleArrayChange = (
//     field: "especificacionesTecnicas" | "caracteristicas",
//     index: number,
//     value: string
//   ) => {
//     const newArray = [...formData[field]];
//     newArray[index] = value;
//     onFieldChange(field, newArray);
//   };

//   const addArrayField = (field: "especificacionesTecnicas" | "caracteristicas") => {
//     onFieldChange(field, [...formData[field], ""]);
//   };

//   const removeArrayField = (field: "especificacionesTecnicas" | "caracteristicas", index: number) => {
//     onFieldChange(field, formData[field].filter((_, i) => i !== index));
//   };

//   const labelClass = "block font-semibold text-gray-700 mb-1";
//   const inputClass = "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400";

//   return (
//     <div className="space-y-6">
//       {/* Especificaciones técnicas */}
//       <div>
//         <label className={labelClass}>Especificaciones técnicas</label>
//         {formData.especificacionesTecnicas?.map((esp, index) => (
//           <div key={index} className="flex gap-2 mb-2">
//             <input
//               type="text"
//               placeholder={`Especificación ${index + 1}`}
//               className={inputClass}
//               value={esp}
//               onChange={(e) =>
//                 handleArrayChange("especificacionesTecnicas", index, e.target.value)
//               }
//             />
//             {index > 0 && (
//               <button
//                 type="button"
//                 onClick={() => removeArrayField("especificacionesTecnicas", index)}
//                 className="text-red-500 hover:text-red-700 px-2"
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() => addArrayField("especificacionesTecnicas")}
//           className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
//         >
//           + Agregar especificación
//         </button>
//       </div>

//       {/* Características */}
//       <div>
//         <label className={labelClass}>Características</label>
//         {formData.caracteristicas?.map((car, index) => (
//           <div key={index} className="flex gap-2 mb-2">
//             <input
//               type="text"
//               placeholder={`Característica ${index + 1}`}
//               className={inputClass}
//               value={car}
//               onChange={(e) =>
//                 handleArrayChange("caracteristicas", index, e.target.value)
//               }
//             />
//             {index > 0 && (
//               <button
//                 type="button"
//                 onClick={() => removeArrayField("caracteristicas", index)}
//                 className="text-red-500 hover:text-red-700 px-2"
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() => addArrayField("caracteristicas")}
//           className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
//         >
//           + Agregar característica
//         </button>
//       </div>

//       {/* Destacado */}
//       <div className="flex items-center gap-2">
//         <input
//           id="destacado"
//           type="checkbox"
//           name="destacado"
//           checked={formData.destacado}
//           onChange={(e) => onFieldChange("destacado", e.target.checked)}
//           className="w-5 h-5"
//         />
//         <label htmlFor="destacado" className="font-semibold text-gray-700">
//           Producto destacado
//         </label>
//       </div>

//       {/* Activo */}
//       <div className="flex items-center gap-2">
//         <input
//           id="activo"
//           type="checkbox"
//           name="activo"
//           checked={formData.activo}
//           onChange={(e) => onFieldChange("activo", e.target.checked)}
//           className="w-5 h-5"
//         />
//         <label htmlFor="activo" className="font-semibold text-gray-700">
//           Producto activo
//         </label>
//       </div>
//     </div>
//   );
// }