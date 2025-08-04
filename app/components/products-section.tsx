'use client'

import { ProductsLoading } from "@/app/components/ProductLoading"
import { Button } from "@/app/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import ProductGrid from "./ProductGridMain"
import { useProductStore } from "@/app/components/store/product-store"

export default function ProductSection() {
  const { products, loading, error } = useProductStore()

  if (loading) return <ProductsLoading />

  if (error) return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 text-center">
        <p className="text-red-500">{error}</p>
        <Button 
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Reintentar
        </Button>
      </div>
    </section>
  )

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white" id="products">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Nuestros <span className="text-brand">Productos</span>
          </h2>
          <p className="max-w-[700px] pb-8 font-bold text-center text-gray-500 md:text-xl/relaxed">
            Soluciones de calidad para cada necesidad de cerramiento y seguridad
          </p>
        </div>

        <ProductGrid />

        <div className="text-center mt-12">
          <Button
            asChild
            className="bg-brand hover:bg-brandHover text-white py-5 px-7 text-base"
          >
            <Link href="/catalogo">
              VER CATÁLOGO COMPLETO
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}