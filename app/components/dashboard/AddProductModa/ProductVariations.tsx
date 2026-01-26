// // components/ProductVariations.tsx
// "use client";

// import { useState } from "react";
// import { ProductFormData, IVariation, IAttribute, VariationFormData } from "@/types/productTypes";
// import CloudinaryUploader from "@/app/components/CloudinaryUploader";

// interface ProductVariationsProps {
//   formData: ProductFormData;
//   errors: Record<string, string>;
//   onVariationsChange: (variations: IVariation[]) => void;
// }

// export default function ProductVariations({
//   formData,
//   errors,
//   onVariationsChange,
// }: ProductVariationsProps) {
//   const [newVariation, setNewVariation] = useState<VariationFormData>({
//     nombre: formData.nombre,
//     medida: "",
//     uMedida: "u",
//     precio: 0,
//     stock: 0,
//     stockMinimo: 5,
//     imagenes: [], // ✅ Inicializado como array vacío
//     atributos: [],
//   });

//   const [newAttribute, setNewAttribute] = useState<IAttribute>({
//     nombre: "",
//     valor: ""
//   });

//   const handleVariationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
    
//     setNewVariation((prev) => ({
//       ...prev,
//       [name]: name === "precio" || name === "stock" || name === "stockMinimo"
//         ? Number(value)
//         : value,
//     }));
//   };

//   const handleImageUpload = (imageUrl: string) => {
//     setNewVariation((prev) => ({
//       ...prev,
//       imagenes: [...prev.imagenes, imageUrl],
//     }));
//   };

//   const handleRemoveImage = (index: number) => {
//     setNewVariation((prev) => ({
//       ...prev,
//       imagenes: prev.imagenes.filter((_, i) => i !== index),
//     }));
//   };

//   const handleAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
    
//     setNewAttribute((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const addAttribute = () => {
//     if (newAttribute.nombre.trim() && newAttribute.valor.trim()) {
//       setNewVariation((prev) => ({
//         ...prev,
//         atributos: [...(prev.atributos || []), { ...newAttribute }]
//       }));
      
//       setNewAttribute({
//         nombre: "",
//         valor: ""
//       });
//     }
//   };

//   const removeAttribute = (index: number) => {
//     setNewVariation((prev) => ({
//       ...prev,
//       atributos: (prev.atributos || []).filter((_, i) => i !== index)
//     }));
//   };

//   const addVariation = () => {
//     if (!newVariation.nombre?.trim() || !newVariation.precio || newVariation.precio <= 0) {
//       return;
//     }

//     const codigoVariacion = `${formData.codigoPrincipal}-${newVariation.nombre
//       .toUpperCase()
//       .replace(/\s+/g, "-")}`;

//     const newVariationWithCode: IVariation = {
//       codigo: codigoVariacion,
//       precio: Number(newVariation.precio) || 0,
//       stock: Number(newVariation.stock) || 0,
//       nombre: newVariation.nombre || "",
//       medida: newVariation.medida || "",
//       uMedida: newVariation.uMedida || "u",
//       descripcion: newVariation.descripcion || "",
//       stockMinimo: Number(newVariation.stockMinimo) || 5,
//       atributos: newVariation.atributos || [],
//       imagenes: newVariation.imagenes || [], // ✅ Imágenes incluidas
//       activo: true,
//     } as IVariation;

//     const existingVariations: IVariation[] = (formData.variaciones || []).map(v => ({
//       codigo: v.codigo || `${formData.codigoPrincipal}-${v.nombre?.toUpperCase().replace(/\s+/g, "-") || "VAR"}`,
//       precio: Number(v.precio) || 0,
//       stock: Number(v.stock) || 0,
//       nombre: v.nombre || "",
//       medida: v.medida || "",
//       uMedida: v.uMedida || "u",
//       descripcion: v.descripcion || "",
//       stockMinimo: Number(v.stockMinimo) || 5,
//       atributos: v.atributos || [],
//       imagenes: v.imagenes || [], // ✅ Imágenes incluidas
//       activo: true,
//     } as IVariation));

//     onVariationsChange([...existingVariations, newVariationWithCode]);

//     setNewVariation({
//       nombre: "",
//       medida: "",
//       uMedida: "u",
//       precio: 0,
//       stock: 0,
//       stockMinimo: 5,
//       imagenes: [], // ✅ Resetear imágenes
//       atributos: [],
//     });
//   };

//   const removeVariation = (index: number) => {
//     const updatedVariations: IVariation[] = (formData.variaciones || [])
//       .map(v => ({
//         codigo: v.codigo || `${formData.codigoPrincipal}-${v.nombre?.toUpperCase().replace(/\s+/g, "-") || "VAR"}`,
//         precio: Number(v.precio) || 0,
//         stock: Number(v.stock) || 0,
//         nombre: v.nombre || "",
//         medida: v.medida || "",
//         uMedida: v.uMedida || "u",
//         descripcion: v.descripcion || "",
//         stockMinimo: Number(v.stockMinimo) || 5,
//         atributos: v.atributos || [],
//         imagenes: v.imagenes || [], // ✅ Imágenes incluidas
//         activo: true,
//       } as IVariation))
//       .filter((_, i) => i !== index);
    
//     onVariationsChange(updatedVariations);
//   };

//   const labelClass = "block font-semibold text-gray-700 mb-1";
//   const inputClass = "border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400";
//   const errorClass = "text-red-500 text-sm mt-1";

//   const unidadesMedida = [
//     { value: "u", label: "Unidad (u)" },
//     { value: "m", label: "Metro (m)" },
//     { value: "mts", label: "Metros (mts)" },
//     { value: "cm", label: "Centímetro (cm)" },
//     { value: "mm", label: "Milímetro (mm)" },
//     { value: "kg", label: "Kilogramo (kg)" },
//     { value: "g", label: "Gramo (g)" },
//     { value: "l", label: "Litro (L)" },
//     { value: "ml", label: "Mililitro (ml)" },
//     { value: "m2", label: "Metro cuadrado (m²)" },
//     { value: "caja", label: "Caja" },
//     { value: "rollo", label: "Rollo" },
//     { value: "jgo", label: "Juego" },
//     { value: "par", label: "Par" },
//     { value: "bidon", label: "Bidón" },
//   ];

//   const variations: IVariation[] = (formData.variaciones || []).map(v => ({
//     codigo: v.codigo || `${formData.codigoPrincipal}-${v.nombre?.toUpperCase().replace(/\s+/g, "-") || "VAR"}`,
//     precio: Number(v.precio) || 0,
//     stock: Number(v.stock) || 0,
//     nombre: v.nombre || "",
//     medida: v.medida || "",
//     uMedida: v.uMedida || "u",
//     descripcion: v.descripcion || "",
//     stockMinimo: Number(v.stockMinimo) || 5,
//     atributos: v.atributos || [],
//     imagenes: v.imagenes || [], // ✅ Imágenes incluidas
//     activo: true,
//   } as IVariation));

//   return (
//     <div className="space-y-6">
//       <div className="bg-blue-50 p-4 rounded-lg">
//         <h3 className="font-semibold text-blue-800 mb-2">Flujo de trabajo</h3>
//         <p className="text-blue-700 text-sm">
//           <strong>Categoría:</strong> {formData.categoria ? "Seleccionada" : "Por seleccionar"} → 
//           <strong> Producto base:</strong> {formData.nombre || "Por definir"} → 
//           <strong> Variaciones:</strong> {variations.length} agregadas
//         </p>
//       </div>

//       <div className="space-y-4">
//         <div className="flex justify-between items-center">
//           <h3 className="text-lg font-semibold">Variaciones del producto</h3>
//           {errors.variaciones && (
//             <p className="text-red-500 text-sm">{errors.variaciones}</p>
//           )}
//         </div>

//         {variations.length > 0 && (
//           <div className="space-y-3">
//             {variations.map((variation, index) => (
//               <div
//                 key={index}
//                 className="grid grid-cols-8 gap-4 items-center bg-gray-50 p-4 rounded-lg border"
//               >
//                 <div>
//                   <span className="text-sm font-medium block text-gray-600">Código:</span>
//                   <p className="font-mono text-sm">{variation.codigo}</p>
//                 </div>
//                 <div>
//                   <span className="text-sm font-medium block text-gray-600">Nombre:</span>
//                   <p className="font-medium text-sm">{variation.nombre}</p>
//                 </div>
//                 <div>
//                   <span className="text-sm font-medium block text-gray-600">Medida:</span>
//                   <p className="text-sm">{variation.medida || "-"}</p>
//                 </div>
//                 <div>
//                   <span className="text-sm font-medium block text-gray-600">U. Medida:</span>
//                   <p className="text-sm">{variation.uMedida || "u"}</p>
//                 </div>
//                 <div>
//                   <span className="text-sm font-medium block text-gray-600">Precio:</span>
//                   <p className="text-sm">${variation.precio.toFixed(2)}</p>
//                 </div>
//                 <div>
//                   <span className="text-sm font-medium block text-gray-600">Stock:</span>
//                   <p className="text-sm">{variation.stock}</p>
//                 </div>
//                 <div>
//                   <span className="text-sm font-medium block text-gray-600">Imágenes:</span>
//                   <p className="text-sm">{variation.imagenes?.length || 0}</p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => removeVariation(index)}
//                   className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-200 rounded"
//                   title="Eliminar variación"
//                 >
//                   Eliminar
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="bg-gray-50 p-6 rounded-lg border">
//           <h4 className="font-medium mb-4 text-lg">Agregar nueva variación</h4>
          
//           <div className="grid grid-cols-2 gap-6 mb-6">
//             <div>
//               <label className={labelClass}>
//                 Nombre específico de la variación *
//               </label>
//               <input
//                 type="text"
//                 name="nombre"
//                 placeholder="Ej: Gancho J, Alambre galvanizado"
//                 className={inputClass}
//                 value={newVariation.nombre || ""}
//                 onChange={handleVariationChange}
//                 required
//               />
//             </div>

//             <div>
//               <label className={labelClass}>Medida descriptiva</label>
//               <input
//                 type="text"
//                 name="medida"
//                 placeholder="Ej: 1.70m x 10m, Diámetro 2cm"
//                 className={inputClass}
//                 value={newVariation.medida || ""}
//                 onChange={handleVariationChange}
//               />
//             </div>

//             <div>
//               <label className={labelClass}>Unidad de medida de venta *</label>
//               <select
//                 name="uMedida"
//                 className={inputClass}
//                 value={newVariation.uMedida || "u"}
//                 onChange={handleVariationChange}
//                 required
//               >
//                 {unidadesMedida.map((unidad) => (
//                   <option key={unidad.value} value={unidad.value}>
//                     {unidad.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className={labelClass}>Precio *</label>
//               <input
//                 type="number"
//                 name="precio"
//                 min="0"
//                 step="0.01"
//                 className={inputClass}
//                 value={newVariation.precio || ""}
//                 onChange={handleVariationChange}
//                 required
//               />
//             </div>

//             <div>
//               <label className={labelClass}>Stock inicial *</label>
//               <input
//                 type="number"
//                 name="stock"
//                 min="0"
//                 className={inputClass}
//                 value={newVariation.stock || ""}
//                 onChange={handleVariationChange}
//                 required
//               />
//             </div>

//             <div>
//               <label className={labelClass}>Stock mínimo</label>
//               <input
//                 type="number"
//                 name="stockMinimo"
//                 min="0"
//                 className={inputClass}
//                 value={newVariation.stockMinimo || ""}
//                 onChange={handleVariationChange}
//               />
//             </div>

//             <div className="col-span-2">
//               <label className={labelClass}>Descripción específica</label>
//               <textarea
//                 name="descripcion"
//                 placeholder="Descripción detallada de esta variación"
//                 className={`${inputClass} h-20 resize-y`}
//                 value={newVariation.descripcion || ""}
//                 onChange={handleVariationChange}
//               />
//             </div>

//             {/* Sección de imágenes para la variación */}
//             <div className="col-span-2">
//               <label className={labelClass}>Imágenes de esta variación</label>
              
//               <CloudinaryUploader
//                 onImageUpload={handleImageUpload}
//                 existingImages={newVariation.imagenes}
//                 folder="products/variations"
//               />

//               {/* Mostrar miniaturas de las imágenes subidas */}
//               {newVariation.imagenes.length > 0 && (
//                 <div className="mt-4">
//                   <h5 className="font-medium mb-2 text-sm">Imágenes subidas para esta variación:</h5>
//                   <div className="grid grid-cols-4 gap-2">
//                     {newVariation.imagenes.map((img, index) => (
//                       <div key={index} className="relative group">
//                         <img
//                           src={img}
//                           alt={`Imagen variación ${index + 1}`}
//                           className="w-full h-16 object-cover rounded border"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => handleRemoveImage(index)}
//                           className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
//                           title="Eliminar imagen"
//                         >
//                           ✕
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="mb-6">
//             <h5 className="font-medium mb-3">Atributos específicos</h5>
            
//             {(newVariation.atributos || []).length > 0 && (
//               <div className="grid grid-cols-2 gap-3 mb-4">
//                 {(newVariation.atributos || []).map((attr, index) => (
//                   <div key={index} className="flex items-center bg-white p-3 rounded border">
//                     <span className="text-sm flex-1">
//                       <strong>{attr.nombre}:</strong> {attr.valor}
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => removeAttribute(index)}
//                       className="text-red-500 hover:text-red-700 text-sm ml-2"
//                       title="Eliminar atributo"
//                     >
//                       ✕
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1">Nombre del atributo</label>
//                 <input
//                   type="text"
//                   name="nombre"
//                   placeholder="Ej: Color, Material, Tamaño"
//                   className={inputClass}
//                   value={newAttribute.nombre}
//                   onChange={handleAttributeChange}
//                 />
//               </div>
//               <div>
//                 <label className="text-sm font-medium text-gray-700 mb-1">Valor del atributo</label>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     name="valor"
//                     placeholder="Ej: Azul, Cuero, Grande"
//                     className={inputClass}
//                     value={newAttribute.valor}
//                     onChange={handleAttributeChange}
//                     onKeyDown={(e) => e.key === "Enter" && addAttribute()}
//                   />
//                   <button
//                     type="button"
//                     onClick={addAttribute}
//                     className="px-4 bg-blue-600 text-white rounded hover:bg-blue-700 whitespace-nowrap"
//                     disabled={!newAttribute.nombre.trim() || !newAttribute.valor.trim()}
//                   >
//                     Agregar
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="button"
//               onClick={addVariation}
//               className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium"
//               disabled={!newVariation.nombre || !newVariation.precio}
//             >
//               + Agregar variación
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }