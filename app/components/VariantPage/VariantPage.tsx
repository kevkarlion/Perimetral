// componentes/VariantPage/VariantPage.tsx
"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductStore } from "@/app/components/store/product-store";
import { IProduct } from "@/types/productTypes";
import { SkeletonVariantPage } from "@/app/components/VariantPage/SkeletonVariantPage";
import Link from "next/link";
import { useState, useEffect } from "react";

interface VariantPageProps {
  initialProduct?: IProduct;
}

export default function VariantPage({ initialProduct }: VariantPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // SOLO LECTURA del store - NO ESCRITURA
  const { products, loading, error, getProductById } = useProductStore();
  
  const [localProduct, setLocalProduct] = useState<IProduct | null>(null);
  const [localLoading, setLocalLoading] = useState(true);

  const productId = searchParams.get("productId");
  const productName = searchParams.get("productName");

  // ===== CORRECCIÓN: SOLO BUSCAR, NO MODIFICAR =====
  useEffect(() => {
    console.log('🔍 VariantPage - Buscando producto:', {
      productId,
      tieneInitialProduct: !!initialProduct,
      totalProductosEnStore: products.length
    });

    // Estrategia de búsqueda (solo lectura):
    let foundProduct: IProduct | null = null;

    // 1. Buscar en el store por ID
    if (productId) {
      foundProduct = getProductById(productId) || null;
      console.log('📦 Encontrado en store:', !!foundProduct);
    }

    // 2. Si no está en store, usar initialProduct (solo para esta página)
    if (!foundProduct && initialProduct) {
      foundProduct = initialProduct;
      console.log('📥 Usando initialProduct');
    }

    setLocalProduct(foundProduct);
    setLocalLoading(false);

    // Debug: mostrar qué productos hay en el store
    console.log('📊 Estado del store (solo lectura):', {
      productos: products.length,
      ids: products.map(p => p._id)
    });

  }, [productId, initialProduct, getProductById, products.length]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(price);

  // Mostrar skeleton si está cargando
  if (loading || localLoading) {
    return <SkeletonVariantPage productName={productName} />;
  }

  // Mostrar error
  if (error && !localProduct) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Error al cargar el producto
          </h1>
          <p className="text-md md:text-lg text-gray-600 max-w-3xl mx-auto">
            {error}
          </p>
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-brand font-bold hover:text-brandHover transition-colors mt-4 mx-auto"
          >
            <ArrowLeft size={16} className="mr-2" />
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Si no hay producto
  if (!localProduct) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Producto no encontrado
          </h1>
          <p className="text-md md:text-lg text-gray-600 max-w-3xl mx-auto">
            El producto que buscas no está disponible.
          </p>
          <button
            onClick={() => router.push("/")}
            className="flex items-center text-brand font-bold hover:text-brandHover transition-colors mt-4 mx-auto"
          >
            <ArrowLeft size={16} className="mr-2" />
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Función para obtener la primera imagen disponible de la variación
  const getFirstImage = (variacion: any) => {
    if (variacion.imagenes && variacion.imagenes.length > 0) return variacion.imagenes[0];
    return null;
  };

  // Usar localProduct en lugar de product
  const product = localProduct;

  return (
    <div className="container mx-auto py-7 px-4 sm:px-6 lg:px-8 mt-[88px] md:mt-0">
      <button
        onClick={() => router.back()}
        className="flex items-center text-brand font-bold hover:text-brandHover transition-colors mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Volver
      </button>

      {product.tieneVariaciones && product.variaciones && product.variaciones.length > 0 && (
        <div className="mt-8">
          <h2 className="text-3xl md:text-2xl font-bold text-gray-900 mb-6">
            Variantes de {productName || product.nombre}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {product.variaciones.map((variante: any) => {
              const firstImage = getFirstImage(variante);

              return (
                <div
                  key={variante._id?.toString()}
                  className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 bg-white flex flex-col h-full"
                >
                  <div className="relative h-48 bg-gray-100">
                    {firstImage ? (
                      <Link
                        href={{
                          pathname: `/catalogo/variants/${variante._id}`,
                          query: { productId, productName: productName || product.nombre },
                        }}
                        className="block h-full w-full"
                      >
                        <Image
                          src={firstImage}
                          alt={`${variante.nombre || product.nombre}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Imagen no disponible
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <Link
                        href={{
                          pathname: `/catalogo/variants/${variante._id}`,
                          query: { productId, productName: productName || product.nombre },
                        }}
                        className="group-hover:text-brandHover transition-colors flex-grow"
                      >
                        <h3 className="text-sm font-semibold text-gray-900">
                          {variante.nombre}
                        </h3>
                      </Link>
                    </div>

                    {variante.medida && variante.medida.trim() !== "" && (
                      <div className="mb-2">
                        <h4 className="text-xs text-gray-500 mb-1">Medida</h4>
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          {variante.medida}
                        </span>
                      </div>
                    )}

                    {(!variante.medida || variante.medida.trim() === "") &&
                      variante.atributos &&
                      variante.atributos.length > 0 && (
                        <div className="mb-2">
                          <h4 className="text-xs text-gray-500 mb-1">Especificaciones</h4>
                          <div className="flex flex-wrap gap-1">
                            {variante.atributos.map(
                              (atributo: { nombre: string; valor: string }, index: number) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full"
                                >
                                  {atributo.nombre}: {atributo.valor}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {variante.precio && (
                      <div className="flex flex-col mt-2">
                        <span className="text-xs text-black">Precio</span>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-brand">
                            {formatPrice(variante.precio)}
                          </span>
                          {(!variante.medida || variante.medida.trim() === "") &&
                            variante.uMedida && (
                              <span className="text-xs text-gray-500">/{variante.uMedida}</span>
                            )}
                        </div>
                      </div>
                    )}

                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <Link
                        href={{
                          pathname: `/catalogo/variants/${variante._id}`,
                          query: { productId, productName: productName || product.nombre },
                        }}
                        className="flex items-center text-xs font-medium text-brand hover:text-brandHover transition-colors group"
                      >
                        <span>Comprar</span>
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8 bg-gradient-to-r from-brand to-brand-dark p-0.5 rounded-lg shadow-md">
        <div className="bg-white rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            ¿Necesitas más información?
          </h3>
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto text-sm">
            Nuestros especialistas están disponibles para responder todas tus consultas.
          </p>
          <a
            href={`https://wa.me/5492984392148?text=Hola,%20me%20interesa%20el%20producto:%20${encodeURIComponent(
              product.nombre
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 bg-brand hover:bg-brandHover text-white font-bold py-2 px-6 rounded-md transition-all shadow-sm hover:shadow-md text-sm"
          >
            <FaWhatsapp className="w-4 h-4" />
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}