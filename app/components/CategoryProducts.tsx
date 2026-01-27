// 'use client'

// import { useSearchParams } from "next/navigation"
// import { useProductStore } from "@/app/components/store/product-store"
// import ProductCard from "@/app/components/ProductCard"
// import Link from "next/link"
// import CategoryProductsSkeleton from "@/app/components/Skeletons/CategoryProductsSkeleton"

// export default function CategoryProducts() {
//   const searchParams = useSearchParams()
//   const categoryId = searchParams.get("category") || ""

//   const { products, loading, error } = useProductStore()

//   // Skeleton mientras estamos cargando o si aún no hay productos cargados
//   const isEmptyInitially = !loading && products.length === 0

//   if (loading || isEmptyInitially) {
//     return (
//       <section className="py-16 bg-gray-50">
//         <div className="container mx-auto px-4">
//           {/* Breadcrumb Skeleton */}
//           <div className="flex gap-2 items-center mb-4">
//             <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
//           </div>
//           {/* Grid skeleton */}
//           <CategoryProductsSkeleton />
//         </div>
//       </section>
//     )
//   }

//   if (error) return <p className="text-center py-8 text-red-500">{error}</p>

//   // Filtrar productos de la categoría
//   const filteredProducts = products.filter(p => {
//     if (!p.categoria) return false
//     return typeof p.categoria === "string"
//       ? p.categoria === categoryId
//       : p.categoria._id === categoryId
//   })

//   const categoryName = filteredProducts[0]?.categoria?.nombre || "Categoría"

//   // Mensaje “No hay productos” solo después de que loading ya terminó
//   if (filteredProducts.length === 0) {
//     return <p className="text-center py-8 text-gray-500">No hay productos en esta categoría</p>
//   }

//   return (
//     <section className="py-16 bg-gray-50">
//       <div className="container mx-auto px-4">
//         {/* Breadcrumb */}
//         <div className="text-sm text-gray-600 mb-4 flex gap-2 items-center">
//           <Link href="/" className="hover:text-brand cursor-pointer">Inicio</Link>
//           <span>›</span>
//           <span className="font-semibold">{categoryName}</span>
//         </div>

//         <h2 className="text-3xl font-bold text-gray-900 mb-8">{categoryName}</h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredProducts.map(product => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }
