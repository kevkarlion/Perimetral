"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import CatalogoProductsSkeleton from "@/app/components/Skeletons/CategoryProductsSkeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Product {
  _id: string;
  nombre: string;
  descripcionCorta?: string;
  imagenes: string[];
  destacado?: boolean;
  activo?: boolean;
  categoria?: { nombre: string };
  variationsCount?: number;
}

export default function CatalogoPage() {
  const { data, error, isLoading } = useSWR("/api/products", fetcher);

  const products: Product[] = Array.isArray(data?.data) ? data.data : [];

  if (isLoading) {
    return (
      <section className="py-16 bg-background text-foreground ">
        <div className="container mx-auto px-4">
          <CatalogoProductsSkeleton />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50 text-center">
        <p className="text-red-500 text-lg">Error al cargar los productos</p>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gray-50 text-center">
        <p className="text-gray-500 text-lg">No hay productos disponibles</p>
      </section>
    );
  }

  return (
    <section className="py-16  bg-background text-foreground">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Catálogo de productos
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

// -------------------------
// Componente ProductCard
// -------------------------
function ProductCard({ product }: { product: Product }) {
  const [currentImage, setCurrentImage] = useState(0);
  const totalImages = product.imagenes?.length || 0;

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % totalImages);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + totalImages) % totalImages);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition">
      {/* IMAGEN / CARRUSEL */}
      <div className="relative w-full h-52 bg-gray-100">
        {totalImages > 0 ? (
          <Image
            src={product.imagenes[currentImage]}
            alt={product.nombre}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-400">Sin imagen</span>
          </div>
        )}

        {/* Navegación de carrusel */}
        {totalImages > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/70 transition"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/70 transition"
            >
              ›
            </button>
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {currentImage + 1}/{totalImages}
            </span>
          </>
        )}

        {product.destacado && (
          <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded">
            Destacado
          </span>
        )}
      </div>

      {/* CUERPO */}
      <div className="p-4 flex flex-col flex-grow">
        {product.categoria?.nombre && (
          <span className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            {product.categoria.nombre}
          </span>
        )}

        <h3 className="text-base font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">
          {product.nombre}
        </h3>

        {product.descripcionCorta && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.descripcionCorta}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>
            {(product.variationsCount ?? 0 > 0)
              ? `${product.variationsCount} variante${product.variationsCount !== 1 ? "s" : ""}`
              : "Sin variaciones"}
          </span>

          <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
              product.activo
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {product.activo ? "Activo" : "Inactivo"}
          </span>
        </div>

        <Link
          href={`/variants?productId=${product._id}`}
          className="mt-auto w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded"
        >
          Ver variantes
        </Link>
      </div>
    </div>
  );
}
