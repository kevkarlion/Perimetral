// // components/ProductSkeleton.tsx
// 'use client'

// import { Skeleton } from "@/components/ui/skeleton"

// export function ProductsLoading() {
//   return (
//     <section className="py-16 bg-gradient-to-b from-gray-50 to-white" id="products">
//       <div className="container mx-auto px-4">
//         {/* Encabezado skeleton (igual al real) */}
//         <div className="text-center mb-12 flex flex-col items-center">
//           <Skeleton className="h-10 w-64 mb-3 mx-auto" />
//           <Skeleton className="h-5 w-[500px] max-w-full pb-8" />
//         </div>

//         {/* Grid de productos skeleton */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
//           {[...Array(6)].map((_, index) => (
//             <div key={index} className="group border-2 border-gray-100 rounded-2xl overflow-hidden bg-white">
//               {/* Imagen */}
//               <div className="relative h-96 bg-gray-100">
//                 <Skeleton className="h-full w-full" />
//               </div>
              
//               {/* Contenido */}
//               <div className="p-6 space-y-4">
//                 <div className="flex justify-between items-start">
//                   <Skeleton className="h-6 w-48" />
//                   <Skeleton className="h-6 w-20" />
//                 </div>
                
//                 <Skeleton className="h-4 w-full" />
//                 <Skeleton className="h-4 w-5/6" />
//                 <Skeleton className="h-4 w-3/4" />
                
//                 <div className="pt-6 border-t border-gray-200">
//                   <Skeleton className="h-4 w-24" />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Botón skeleton */}
//         <div className="text-center mt-12">
//           <Skeleton className="h-12 w-48 mx-auto" />
//         </div>
//       </div>
//     </section>
//   )
// }