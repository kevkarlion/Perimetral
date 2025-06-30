// "use client";

// import React, { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   Tabs,
//   TabsList,
//   TabsTrigger,
//   TabsContent,
// } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Table,
//   TableHead,
//   TableRow,
//   TableHeader,
//   TableBody,
//   TableCell,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import {
//   fetchProducts,
//   createProduct,
//   deleteProduct,
//   updateProduct,
// } from "@/lib/services/apiClient";
// import { v4 as uuidv4 } from "uuid";

// type Product = {
//   _id: string;
//   id: string;
//   nombre: string;
//   descripcionCorta: string;
//   descripcionLarga: string;
//   categoria: string;
//   imagen: string;
//   imagenes: string[];
//   imagenesAdicionales: string[];
//   precio: string;
//   tieneVariaciones: boolean;
//   destacado: boolean;
//   especificaciones: string[];
//   caracteristicas: string[];
//   stock: number;
//   stockMinimo: number;
//   variaciones: Variation[];
//   historialStock: any[];
//   createdAt: string;
//   updatedAt: string;
// };

// type Variation = {
//   id: string;
//   medida: string;
//   precio: number;
//   stock: number;
//   sku: string;
// };

// type Specification = {
//   id: string;
//   key: string;
//   value: string;
// };

// type Feature = {
//   id: string;
//   text: string;
// };

// const Dashboard = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [variationModal, setVariationModal] = useState<string | null>(null);
//   const [imageModal, setImageModal] = useState<string | null>(null);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//   const [selectedVariation, setSelectedVariation] = useState<Variation | null>(null);

//   const [newProduct, setNewProduct] = useState<Omit<Product, '_id' | 'createdAt' | 'updatedAt'>>({
//     id: uuidv4(),
//     nombre: "",
//     descripcionCorta: "",
//     descripcionLarga: "",
//     categoria: "",
//     imagen: "",
//     imagenes: [],
//     imagenesAdicionales: [],
//     precio: "",
//     tieneVariaciones: false,
//     destacado: false,
//     especificaciones: [],
//     caracteristicas: [],
//     stock: 0,
//     stockMinimo: 0,
//     variaciones: [],
//     historialStock: [],
//   });

//   const [newVariation, setNewVariation] = useState<Variation>({
//     id: uuidv4(),
//     medida: "",
//     precio: 0,
//     stock: 0,
//     sku: uuidv4(),
//   });

//   const [newSpecification, setNewSpecification] = useState<Specification>({
//     id: uuidv4(),
//     key: "",
//     value: ""
//   });

//   const [newFeature, setNewFeature] = useState<Feature>({
//     id: uuidv4(),
//     text: ""
//   });

//   const [newImage, setNewImage] = useState("");

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   async function loadProducts() {
//     try {
//       setLoading(true);
//       const prod = await fetchProducts();
//       setProducts(prod);
//     } catch (err) {
//       console.error("❌ Error al cargar productos:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleCreateProduct() {
//     try {
//       await createProduct({ ...newProduct });
//       await loadProducts();
//       setModalOpen(false);
//       resetProductForm();
//     } catch (err) {
//       console.error("❌ Error al crear producto:", err);
//     }
//   }

//   function resetProductForm() {
//     setNewProduct({
//       id: uuidv4(),
//       nombre: "",
//       descripcionCorta: "",
//       descripcionLarga: "",
//       categoria: "",
//       imagen: "",
//       imagenes: [],
//       imagenesAdicionales: [],
//       precio: "",
//       tieneVariaciones: false,
//       destacado: false,
//       especificaciones: [],
//       caracteristicas: [],
//       stock: 0,
//       stockMinimo: 0,
//       variaciones: [],
//       historialStock: [],
//     });
//   }

//   async function handleDeleteProduct(id: string) {
//     if (!confirm("¿Eliminar producto?")) return;
//     try {
//       await deleteProduct(id);
//       await loadProducts();
//     } catch (err) {
//       console.error("❌ Error al eliminar producto:", err);
//     }
//   }

//   async function handleSaveVariation() {
//     if (!selectedProduct) return;
    
//     try {
//       let updatedVariations = [...selectedProduct.variaciones];
      
//       if (selectedVariation) {
//         // Editar variación existente
//         updatedVariations = updatedVariations.map(v => 
//           v.id === selectedVariation.id ? newVariation : v
//         );
//       } else {
//         // Agregar nueva variación
//         updatedVariations.push(newVariation);
//       }
      
//       await updateProduct(selectedProduct._id, { variaciones: updatedVariations });
//       await loadProducts();
//       setVariationModal(null);
//       setSelectedProduct(null);
//       setSelectedVariation(null);
//       setNewVariation({
//         id: uuidv4(),
//         medida: "",
//         precio: 0,
//         stock: 0,
//         sku: uuidv4(),
//       });
//     } catch (err) {
//       console.error("❌ Error al guardar variación:", err);
//     }
//   }

//   async function handleDeleteVariation(variationId: string) {
//     if (!selectedProduct || !confirm("¿Eliminar esta variación?")) return;
    
//     try {
//       const updatedVariations = selectedProduct.variaciones.filter(v => v.id !== variationId);
//       await updateProduct(selectedProduct._id, { variaciones: updatedVariations });
//       await loadProducts();
//       setSelectedVariation(null);
//       setNewVariation({
//         id: uuidv4(),
//         medida: "",
//         precio: 0,
//         stock: 0,
//         sku: uuidv4(),
//       });
//     } catch (err) {
//       console.error("❌ Error al eliminar variación:", err);
//     }
//   }

//   function addSpecification() {
//     if (!newSpecification.key || !newSpecification.value) return;
//     setNewProduct({
//       ...newProduct,
//       especificaciones: [...newProduct.especificaciones, `${newSpecification.key}: ${newSpecification.value}`]
//     });
//     setNewSpecification({ id: uuidv4(), key: "", value: "" });
//   }

//   function removeSpecification(index: number) {
//     const updatedSpecs = [...newProduct.especificaciones];
//     updatedSpecs.splice(index, 1);
//     setNewProduct({ ...newProduct, especificaciones: updatedSpecs });
//   }

//   function addFeature() {
//     if (!newFeature.text) return;
//     setNewProduct({
//       ...newProduct,
//       caracteristicas: [...newProduct.caracteristicas, newFeature.text]
//     });
//     setNewFeature({ id: uuidv4(), text: "" });
//   }

//   function removeFeature(index: number) {
//     const updatedFeatures = [...newProduct.caracteristicas];
//     updatedFeatures.splice(index, 1);
//     setNewProduct({ ...newProduct, caracteristicas: updatedFeatures });
//   }

//   function addImage() {
//     if (!newImage) return;
//     setNewProduct({
//       ...newProduct,
//       imagenes: [...newProduct.imagenes, newImage]
//     });
//     setNewImage("");
//   }

//   function removeImage(index: number) {
//     const updatedImages = [...newProduct.imagenes];
//     updatedImages.splice(index, 1);
//     setNewProduct({ ...newProduct, imagenes: updatedImages });
//   }

//   function handleVariationSelect(variation: Variation) {
//     setSelectedVariation(variation);
//     setNewVariation({ ...variation });
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <h1 className="text-xl font-bold mb-4">Panel de Administración</h1>
//       <Tabs defaultValue="products">
//         <TabsList className="mb-4 bg-transparent space-x-2">
//           <TabsTrigger 
//             value="products" 
//             className="data-[state=active]:bg-black data-[state=active]:text-white px-4 py-2 border border-black rounded-none hover:bg-gray-100 transition-colors"
//           >
//             Productos
//           </TabsTrigger>
//           <TabsTrigger 
//             value="orders" 
//             className="data-[state=active]:bg-black data-[state=active]:text-white px-4 py-2 border border-black rounded-none hover:bg-gray-100 transition-colors text-black"
//           >
//             Órdenes
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="products">
//           <Card className="bg-white border border-black rounded-none shadow-none">
//             <CardContent className="p-4 space-y-4">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-md font-semibold">Listado de Productos</h2>
//                 <Button 
//                   onClick={() => setModalOpen(true)}
//                   className="bg-black text-white hover:bg-gray-800 rounded-none border border-black px-4 py-2"
//                 >
//                   Agregar Producto
//                 </Button>
//               </div>
//               {loading ? (
//                 <p>Cargando productos...</p>
//               ) : (
//                 <Table className="text-sm border border-black">
//                   <TableHeader>
//                     <TableRow className="bg-black hover:bg-black">
//                       <TableHead className="text-white font-medium">ID</TableHead>
//                       <TableHead className="text-white font-medium">Nombre</TableHead>
//                       <TableHead className="text-white font-medium">Categoría</TableHead>
//                       <TableHead className="text-white font-medium">Precio</TableHead>
//                       <TableHead className="text-white font-medium">Stock</TableHead>
//                       <TableHead className="text-white font-medium">Destacado</TableHead>
//                       <TableHead className="text-white font-medium">Acciones</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {products.map((p) => (
//                       <TableRow key={p._id} className="hover:bg-gray-50 border-b border-black">
//                         <TableCell className="py-3">{p.id}</TableCell>
//                         <TableCell className="py-3">{p.nombre}</TableCell>
//                         <TableCell className="py-3">{p.categoria}</TableCell>
//                         <TableCell className="py-3">
//                           {p.tieneVariaciones && p.variaciones.length > 0 ? (
//                             <Select onValueChange={(value) => {
//                               const selected = p.variaciones.find(v => v.medida === value);
//                               if (selected) {
//                                 setSelectedVariation(selected);
//                               }
//                             }}>
//                               <SelectTrigger className="border-black rounded-none">
//                                 <SelectValue placeholder="Seleccione medida" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 {p.variaciones.map((v, i) => (
//                                   <SelectItem key={i} value={v.medida}>
//                                     {v.medida} - ${v.precio}
//                                   </SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           ) : (
//                             p.precio
//                           )}
//                         </TableCell>
//                         <TableCell className="py-3">
//                           {p.stock} {p.stock < p.stockMinimo && <span className="text-xs text-gray-500">(Mín: {p.stockMinimo})</span>}
//                         </TableCell>
//                         <TableCell className="py-3">
//                           {p.destacado ? "⭐" : "—"}
//                         </TableCell>
//                         <TableCell className="py-3">
//                           <div className="flex gap-2">
//                             <Button 
//                               size="sm" 
//                               variant="outline" 
//                               onClick={() => {
//                                 setSelectedProduct(p);
//                                 setVariationModal(p._id);
//                               }}
//                               className="border-black rounded-none hover:bg-gray-100"
//                             >
//                               {p.tieneVariaciones ? "Variaciones" : "+ Variación"}
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline" 
//                               onClick={() => setImageModal(p._id)}
//                               className="border-black rounded-none hover:bg-gray-100"
//                             >
//                               Imágenes
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               onClick={() => handleDeleteProduct(p._id)}
//                               className="bg-white text-black border border-black rounded-none hover:bg-gray-100 hover:text-black"
//                             >
//                               Eliminar
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="orders">
//           <Card className="bg-white border border-black rounded-none shadow-none">
//             <CardContent className="p-4">
//               <p className="text-sm">Módulo de órdenes en desarrollo.</p>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* MODAL PRODUCTO */}
//       <Dialog open={modalOpen} onOpenChange={setModalOpen}>
//         <DialogContent className="bg-white max-w-4xl border border-black rounded-none max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold">
//               {newProduct.id ? "Editar Producto" : "Agregar Producto"}
//             </DialogTitle>
//           </DialogHeader>
          
//           <div className="grid grid-cols-2 gap-6">
//             {/* Columna izquierda */}
//             <div className="space-y-4">
//               <div>
//                 <Label className="text-sm font-medium">ID de Producto</Label>
//                 <Input 
//                   value={newProduct.id} 
//                   onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
//                   className="border-black rounded-none mt-1"
//                 />
//               </div>

//               <div>
//                 <Label className="text-sm font-medium">Nombre*</Label>
//                 <Input 
//                   value={newProduct.nombre} 
//                   onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
//                   className="border-black rounded-none mt-1"
//                   required
//                 />
//               </div>

//               <div>
//                 <Label className="text-sm font-medium">Descripción Corta*</Label>
//                 <Input 
//                   value={newProduct.descripcionCorta} 
//                   onChange={(e) => setNewProduct({ ...newProduct, descripcionCorta: e.target.value })}
//                   className="border-black rounded-none mt-1"
//                   required
//                 />
//               </div>

//               <div>
//                 <Label className="text-sm font-medium">Categoría*</Label>
//                 <Input 
//                   value={newProduct.categoria} 
//                   onChange={(e) => setNewProduct({ ...newProduct, categoria: e.target.value })}
//                   className="border-black rounded-none mt-1"
//                   required
//                 />
//               </div>

//               <div>
//                 <Label className="text-sm font-medium">Precio* (ej: "$260/ mt.")</Label>
//                 <Input 
//                   value={newProduct.precio} 
//                   onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })}
//                   className="border-black rounded-none mt-1"
//                   required
//                   disabled={newProduct.tieneVariaciones}
//                 />
//               </div>

//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="destacado"
//                     checked={newProduct.destacado}
//                     onChange={(e) => setNewProduct({ ...newProduct, destacado: e.target.checked })}
//                     className="border-black rounded-none mr-2"
//                   />
//                   <Label htmlFor="destacado" className="text-sm font-medium">
//                     Producto Destacado
//                   </Label>
//                 </div>

//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="tieneVariaciones"
//                     checked={newProduct.tieneVariaciones}
//                     onChange={(e) => setNewProduct({ ...newProduct, tieneVariaciones: e.target.checked })}
//                     className="border-black rounded-none mr-2"
//                   />
//                   <Label htmlFor="tieneVariaciones" className="text-sm font-medium">
//                     Tiene Variaciones
//                   </Label>
//                 </div>
//               </div>
//             </div>

//             {/* Columna derecha */}
//             <div className="space-y-4">
//               <div>
//                 <Label className="text-sm font-medium">Imagen Principal (URL)*</Label>
//                 <Input 
//                   value={newProduct.imagen} 
//                   onChange={(e) => setNewProduct({ ...newProduct, imagen: e.target.value })}
//                   className="border-black rounded-none mt-1"
//                   required
//                 />
//               </div>

//               <div>
//                 <Label className="text-sm font-medium">Stock*</Label>
//                 <Input 
//                   type="number" 
//                   value={newProduct.stock} 
//                   onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
//                   className="border-black rounded-none mt-1"
//                   required
//                   disabled={newProduct.tieneVariaciones}
//                 />
//               </div>

//               <div>
//                 <Label className="text-sm font-medium">Stock Mínimo*</Label>
//                 <Input 
//                   type="number" 
//                   value={newProduct.stockMinimo} 
//                   onChange={(e) => setNewProduct({ ...newProduct, stockMinimo: Number(e.target.value) })}
//                   className="border-black rounded-none mt-1"
//                   required
//                 />
//               </div>

//               <div>
//                 <Label className="text-sm font-medium">Descripción Larga</Label>
//                 <Textarea 
//                   value={newProduct.descripcionLarga} 
//                   onChange={(e) => setNewProduct({ ...newProduct, descripcionLarga: e.target.value })}
//                   className="border-black rounded-none mt-1 min-h-[100px]"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Sección de Variaciones (solo si tieneVariaciones es true) */}
//           {newProduct.tieneVariaciones && (
//             <div className="mt-6 border-t border-black pt-4">
//               <h3 className="text-md font-semibold mb-3">Variaciones del Producto</h3>
//               <div className="grid grid-cols-4 gap-4 mb-3">
//                 <div>
//                   <Label className="text-sm font-medium">Medida*</Label>
//                   <Input 
//                     value={newVariation.medida} 
//                     onChange={(e) => setNewVariation({ ...newVariation, medida: e.target.value })}
//                     className="border-black rounded-none mt-1"
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium">Precio*</Label>
//                   <Input 
//                     type="number" 
//                     value={newVariation.precio} 
//                     onChange={(e) => setNewVariation({ ...newVariation, precio: Number(e.target.value) })}
//                     className="border-black rounded-none mt-1"
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium">Stock*</Label>
//                   <Input 
//                     type="number" 
//                     value={newVariation.stock} 
//                     onChange={(e) => setNewVariation({ ...newVariation, stock: Number(e.target.value) })}
//                     className="border-black rounded-none mt-1"
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium">SKU</Label>
//                   <Input 
//                     value={newVariation.sku} 
//                     onChange={(e) => setNewVariation({ ...newVariation, sku: e.target.value })}
//                     className="border-black rounded-none mt-1"
//                   />
//                 </div>
//               </div>
//               <Button 
//                 onClick={() => {
//                   setNewProduct({
//                     ...newProduct,
//                     variaciones: [...newProduct.variaciones, newVariation]
//                   });
//                   setNewVariation({
//                     id: uuidv4(),
//                     medida: "",
//                     precio: 0,
//                     stock: 0,
//                     sku: uuidv4(),
//                   });
//                 }}
//                 className="bg-black text-white rounded-none border border-black hover:bg-gray-800 mb-4"
//               >
//                 Agregar Variación
//               </Button>

//               {newProduct.variaciones.length > 0 && (
//                 <div className="border border-black p-2">
//                   <h4 className="text-sm font-medium mb-2">Variaciones agregadas:</h4>
//                   <ul className="space-y-2">
//                     {newProduct.variaciones.map((variation, index) => (
//                       <li key={index} className="flex justify-between items-center text-sm">
//                         <span>{variation.medida} - ${variation.precio} (Stock: {variation.stock})</span>
//                         <div className="flex gap-2">
//                           <Button 
//                             size="sm" 
//                             onClick={() => {
//                               setNewVariation(variation);
//                             }}
//                             className="bg-white text-black border border-black rounded-none hover:bg-gray-100"
//                           >
//                             Editar
//                           </Button>
//                           <Button 
//                             size="sm" 
//                             onClick={() => {
//                               setNewProduct({
//                                 ...newProduct,
//                                 variaciones: newProduct.variaciones.filter((_, i) => i !== index)
//                               });
//                             }}
//                             className="bg-white text-black border border-black rounded-none hover:bg-gray-100"
//                           >
//                             Eliminar
//                           </Button>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Sección de Especificaciones */}
//           <div className="mt-6 border-t border-black pt-4">
//             <h3 className="text-md font-semibold mb-3">Especificaciones Técnicas</h3>
//             <div className="grid grid-cols-2 gap-4 mb-3">
//               <div>
//                 <Label className="text-sm font-medium">Clave</Label>
//                 <Input 
//                   value={newSpecification.key} 
//                   onChange={(e) => setNewSpecification({ ...newSpecification, key: e.target.value })}
//                   className="border-black rounded-none mt-1"
//                 />
//               </div>
//               <div>
//                 <Label className="text-sm font-medium">Valor</Label>
//                 <Input 
//                   value={newSpecification.value} 
//                   onChange={(e) => setNewSpecification({ ...newSpecification, value: e.target.value })}
//                   className="border-black rounded-none mt-1"
//                 />
//               </div>
//             </div>
//             <Button 
//               onClick={addSpecification}
//               className="bg-black text-white rounded-none border border-black hover:bg-gray-800 mb-4"
//             >
//               Agregar Especificación
//             </Button>

//             {newProduct.especificaciones.length > 0 && (
//               <div className="border border-black p-2">
//                 <h4 className="text-sm font-medium mb-2">Especificaciones agregadas:</h4>
//                 <ul className="space-y-2">
//                   {newProduct.especificaciones.map((spec, index) => (
//                     <li key={index} className="flex justify-between items-center text-sm">
//                       <span>{spec}</span>
//                       <Button 
//                         size="sm" 
//                         onClick={() => removeSpecification(index)}
//                         className="bg-white text-black border border-black rounded-none hover:bg-gray-100"
//                       >
//                         Eliminar
//                       </Button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Sección de Características */}
//           <div className="mt-6 border-t border-black pt-4">
//             <h3 className="text-md font-semibold mb-3">Características Principales</h3>
//             <div className="mb-3">
//               <Label className="text-sm font-medium">Característica</Label>
//               <Input 
//                 value={newFeature.text} 
//                 onChange={(e) => setNewFeature({ ...newFeature, text: e.target.value })}
//                 className="border-black rounded-none mt-1"
//               />
//             </div>
//             <Button 
//               onClick={addFeature}
//               className="bg-black text-white rounded-none border border-black hover:bg-gray-800 mb-4"
//             >
//               Agregar Característica
//             </Button>

//             {newProduct.caracteristicas.length > 0 && (
//               <div className="border border-black p-2">
//                 <h4 className="text-sm font-medium mb-2">Características agregadas:</h4>
//                 <ul className="space-y-2">
//                   {newProduct.caracteristicas.map((feature, index) => (
//                     <li key={index} className="flex justify-between items-center text-sm">
//                       <span>{feature}</span>
//                       <Button 
//                         size="sm" 
//                         onClick={() => removeFeature(index)}
//                         className="bg-white text-black border border-black rounded-none hover:bg-gray-100"
//                       >
//                         Eliminar
//                       </Button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           {/* Sección de Imágenes */}
//           <div className="mt-6 border-t border-black pt-4">
//             <h3 className="text-md font-semibold mb-3">Imágenes Adicionales</h3>
//             <div className="mb-3">
//               <Label className="text-sm font-medium">URL de Imagen</Label>
//               <Input 
//                 value={newImage} 
//                 onChange={(e) => setNewImage(e.target.value)}
//                 className="border-black rounded-none mt-1"
//               />
//             </div>
//             <Button 
//               onClick={addImage}
//               className="bg-black text-white rounded-none border border-black hover:bg-gray-800 mb-4"
//             >
//               Agregar Imagen
//             </Button>

//             {newProduct.imagenes.length > 0 && (
//               <div className="border border-black p-2">
//                 <h4 className="text-sm font-medium mb-2">Imágenes agregadas:</h4>
//                 <ul className="space-y-2">
//                   {newProduct.imagenes.map((img, index) => (
//                     <li key={index} className="flex justify-between items-center text-sm">
//                       <span className="truncate max-w-xs">{img}</span>
//                       <Button 
//                         size="sm" 
//                         onClick={() => removeImage(index)}
//                         className="bg-white text-black border border-black rounded-none hover:bg-gray-100"
//                       >
//                         Eliminar
//                       </Button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>

//           <div className="mt-6 pt-4 border-t border-black">
//             <Button 
//               className="w-full bg-black text-white rounded-none border border-black hover:bg-gray-800"
//               onClick={handleCreateProduct}
//             >
//               Guardar Producto
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* MODAL VARIACIONES */}
//       <Dialog open={!!variationModal} onOpenChange={() => {
//         setVariationModal(null);
//         setSelectedProduct(null);
//         setSelectedVariation(null);
//       }}>
//         <DialogContent className="bg-white border border-black rounded-none max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold">
//               {selectedProduct?.nombre} - Gestión de Variaciones
//             </DialogTitle>
//           </DialogHeader>
          
//           {selectedProduct && (
//             <div className="space-y-4">
//               <div className="grid grid-cols-3 gap-4">
//                 <div>
//                   <Label className="text-sm font-medium">Medida*</Label>
//                   <Input 
//                     value={newVariation.medida} 
//                     onChange={(e) => setNewVariation({ ...newVariation, medida: e.target.value })}
//                     className="border-black rounded-none mt-1"
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium">Precio*</Label>
//                   <Input 
//                     type="number" 
//                     value={newVariation.precio} 
//                     onChange={(e) => setNewVariation({ ...newVariation, precio: Number(e.target.value) })}
//                     className="border-black rounded-none mt-1"
//                   />
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium">Stock*</Label>
//                   <Input 
//                     type="number" 
//                     value={newVariation.stock} 
//                     onChange={(e) => setNewVariation({ ...newVariation, stock: Number(e.target.value) })}
//                     className="border-black rounded-none mt-1"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <Label className="text-sm font-medium">SKU</Label>
//                 <Input 
//                   value={newVariation.sku} 
//                   onChange={(e) => setNewVariation({ ...newVariation, sku: e.target.value })}
//                   className="border-black rounded-none mt-1"
//                 />
//               </div>
              
//               <Button 
//                 onClick={handleSaveVariation}
//                 className="w-full bg-black text-white rounded-none border border-black hover:bg-gray-800"
//               >
//                 {selectedVariation ? "Actualizar Variación" : "Agregar Variación"}
//               </Button>
              
//               {selectedProduct.variaciones.length > 0 && (
//                 <div className="border border-black p-2">
//                   <h4 className="text-sm font-medium mb-2">Variaciones existentes:</h4>
//                   <ul className="space-y-2">
//                     {selectedProduct.variaciones.map((variation, index) => (
//                       <li key={index} className="flex justify-between items-center text-sm">
//                         <span>{variation.medida} - ${variation.precio} (Stock: {variation.stock})</span>
//                         <div className="flex gap-2">
//                           <Button 
//                             size="sm" 
//                             onClick={() => handleVariationSelect(variation)}
//                             className="bg-white text-black border border-black rounded-none hover:bg-gray-100"
//                           >
//                             Editar
//                           </Button>
//                           <Button 
//                             size="sm" 
//                             onClick={() => handleDeleteVariation(variation.id)}
//                             className="bg-white text-black border border-black rounded-none hover:bg-gray-100"
//                           >
//                             Eliminar
//                           </Button>
//                         </div>
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* MODAL IMÁGENES */}
//       <Dialog open={!!imageModal} onOpenChange={() => setImageModal(null)}>
//         <DialogContent className="bg-white border border-black rounded-none max-w-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-lg font-semibold">Gestión de Imágenes</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <p className="text-sm">Funcionalidad de gestión de imágenes en desarrollo.</p>
//             <Button 
//               className="bg-black text-white rounded-none border border-black hover:bg-gray-800"
//               onClick={() => setImageModal(null)}
//             >
//               Cerrar
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Dashboard;