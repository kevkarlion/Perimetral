"use client";

import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import ProductCard from "@/app/components/ProductCard";
import { IProduct } from "@/app/components/store/product-store";
import Link from "next/link";
import CategoryProductsSkeleton from "@/app/components/Skeletons/CategoryProductsSkeleton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface Product {
  _id: string;
  nombre: string;
  descripcionCorta?: string;
  imagenes: string[];
  destacado?: boolean;
  activo?: boolean;
  categoria?: {
    _id: string;
    nombre: string;
  };
  variationsCount?: number;
}

export default function CategoryProducts() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const { data, error, isLoading } = useSWR(
    categoryId ? `/api/products?categoryId=${categoryId}` : null,
    fetcher
  );

  const products: IProduct[] = Array.isArray(data?.data) ? data.data : [];

  // 1. LOADING
  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <CategoryProductsSkeleton />
        </div>
      </section>
    );
  }

  // 2. ERROR
  if (error) {
    return (
      <p className="text-center py-16 text-red-500">
        Error al cargar los productos
      </p>
    );
  }

  // 3. EMPTY
  if (products.length === 0) {
    return (
      <p className="text-center py-16 text-gray-500">
        No hay productos en esta categoría
      </p>
    );
  }

  const categoryName = products[0]?.categoria?.nombre || "Categoría";

  // 4. DATA
  return (
    <section className="py-16 bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="text-sm text-gray-600 mb-4 flex gap-2 items-center">
          <Link href="/" className="hover:text-brand cursor-pointer">
            Inicio
          </Link>
          <span>›</span>
          <span className="font-semibold">{categoryName}</span>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          {categoryName}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
