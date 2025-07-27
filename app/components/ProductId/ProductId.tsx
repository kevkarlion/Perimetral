"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Check,
  Star,
  ShoppingCart,
} from "lucide-react";
import { useCartStore } from "@/app/components/store/cartStore";
import { useProductStore } from "@/app/components/store/product-store";
import { Button } from "@/app/components/ui/button";
import { CartSidebar } from "@/app/components/CartSideBar/CartSideBar";
import { AddToCartNotification } from "@/app/components/AddToCartNotification/AddToCartNotification";
import { IProduct, IVariation } from "@/types/productTypes";
import { ProductIdSkeleton } from "@/app/components/ProductId/ProductIdSkeleton";

interface ProductImage {
  src: string;
  alt: string;
}

interface ProductIdProps {
  initialProduct?: IProduct;
  initialVariationId?: string;
}

const defaultProduct: IProduct = {
  _id: "",
  codigoPrincipal: "",
  nombre: "Cargando producto...",
  categoria: "",
  descripcionCorta: "",
  tieneVariaciones: false,
  variaciones: [],
};

export default function ProductId({
  initialProduct,
  initialVariationId,
}: ProductIdProps) {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const variationId = searchParams.get("variation") || initialVariationId;

  const { currentProduct, getProductById, setCurrentProduct } =
    useProductStore();

  const [product, setProduct] = useState<IProduct | null>(
    initialProduct || (currentProduct?._id === id ? currentProduct : null)
  );
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState<string | null>(null);
  const [imagenPrincipal, setImagenPrincipal] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [showCartSidebar, setShowCartSidebar] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<IVariation | null>(
    null
  );

  const addItem = useCartStore((state) => state.addItem);

  const getSafeImages = (product: IProduct | null): ProductImage[] => {
    if (!product) {
      return [
        { src: "/placeholder-product.jpg", alt: "Producto no disponible" },
      ];
    }

    const images = selectedVariation?.imagenes?.length
      ? selectedVariation.imagenes
      : product.imagenesGenerales ?? [];

    return images.length > 0
      ? images.map((img, index) => ({
          src: img || "/placeholder-product.jpg",
          alt: product.nombre
            ? `${product.nombre} - Imagen ${index + 1}`
            : "Imagen del producto",
        }))
      : [
          {
            src: "/placeholder-product.jpg",
            alt: product.nombre || "Producto sin imágenes",
          },
        ];
  };

  const formatPrice = (price?: number) => {
    return (
      price?.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 0,
      }) || "$ --"
    );
  };

  useEffect(() => {
    if (product && variationId) {
      const variation =
        product.variaciones?.find((v) => v._id === variationId) || null;
      setSelectedVariation(variation);
    }
  }, [product, variationId]);

  useEffect(() => {
    const storedProduct = getProductById(id as string);
    if (storedProduct) {
      setProduct(storedProduct);
      setCurrentProduct(storedProduct);
      return;
    }

    if (initialProduct) {
      setProduct(initialProduct);
      setCurrentProduct(initialProduct);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/stock/${id}`);

        if (!response.ok) {
          throw new Error(`Error al cargar producto: ${response.status}`);
        }

        const result = await response.json();

        if (result?.success && result.data) {
          setProduct(result.data);
          setCurrentProduct(result.data);
        } else {
          throw new Error(result?.error || "Datos de producto no válidos");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, initialProduct, getProductById, setCurrentProduct]);

  const handleAddToCart = () => {
    if (!product) return;

    const imagenes = getSafeImages(product);
    const itemToAdd = {
      id: selectedVariation
        ? `${product._id}-${selectedVariation._id}`
        : product._id,
      name:
        product.nombre +
        (selectedVariation ? ` - ${selectedVariation.medida}` : ""),
      price: selectedVariation ? selectedVariation.precio : product.precio || 0,
      image: imagenes[0]?.src || "/placeholder-product.jpg",
      variation: selectedVariation
        ? {
            medida: selectedVariation.medida,
            codigo: selectedVariation.codigo,
          }
        : undefined,
    };

    addItem(itemToAdd);

    setIsAddedToCart(true);
    setShowNotification(true);
    setShowCartSidebar(true);

    setTimeout(() => {
      setShowNotification(false);
      setIsAddedToCart(false);
    }, 3000);
  };

  const safeProduct = product || defaultProduct;
  const imagenes = getSafeImages(product);
  const specsToShow = safeProduct.especificacionesTecnicas || [];
  const variationAttributes = selectedVariation?.atributos || {};

  if (loading) {
    return <ProductIdSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Error al cargar el producto
          </h1>
          <p className="text-lg text-gray-600 mb-6">{error}</p>
          <Button asChild>
            <Link href="/catalogo" className="text-white">
              Volver al catálogo
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-8">
      <div className="mb-6">
        <Link
          href="/catalogo"
          className="inline-flex items-center text-brand hover:text-brandHover transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver al catálogo
        </Link>
      </div>

      <div className="md:hidden space-y-3 mb-6">
        {safeProduct.destacado && (
          <div className="inline-flex items-center bg-brand text-black text-xs font-bold px-3 py-1 rounded-full">
            <Star className="h-3.5 w-3.5 mr-1.5" /> DESTACADO
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900">
          {safeProduct.nombre}
          {selectedVariation && ` - ${selectedVariation.medida}`}
        </h1>
        {safeProduct.categoria && (
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {safeProduct.categoria}
          </span>
        )}
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex flex-col lg:flex-row-reverse gap-4 lg:sticky lg:top-32 lg:self-start">
          <div className="w-full">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={
                  imagenes[imagenPrincipal]?.src || "/placeholder-product.jpg"
                }
                alt={imagenes[imagenPrincipal]?.alt || "Imagen del producto"}
                fill
                className="object-contain p-2"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {imagenes.map((imagen, index) => (
              <button
                key={index}
                onClick={() => setImagenPrincipal(index)}
                className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 relative rounded-md overflow-hidden border-2 transition-all ${
                  imagenPrincipal === index
                    ? "border-brand scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={imagen.src}
                  alt={imagen.alt}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="hidden md:block space-y-3">
            {safeProduct.destacado && (
              <div className="inline-flex items-center bg-brand text-white text-xs font-bold px-3 py-1 rounded-full">
                <Star className="h-3.5 w-3.5 mr-1.5" /> DESTACADO
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {safeProduct.nombre}
              {selectedVariation && ` - ${selectedVariation.medida}`}
            </h1>
            {safeProduct.categoria && (
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {safeProduct.categoria}
              </span>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <p className="text-2xl md:text-3xl font-bold text-brand">
                {formatPrice(
                  selectedVariation
                    ? selectedVariation.precio
                    : safeProduct.precio
                )}
              </p>
              <span className="text-sm text-gray-500">+ IVA</span>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full mt-4 bg-brand hover:bg-brand-dark"
              disabled={isAddedToCart || !product}
            >
              {isAddedToCart ? (
                <>
                  <Check className="h-5 w-5 mr-2" /> Añadido al carrito
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" /> Añadir al carrito
                </>
              )}
            </Button>
          </div>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg">
              {selectedVariation?.descripcion ||
                safeProduct.descripcionLarga ||
                safeProduct.descripcionCorta ||
                "Descripción no disponible"}
            </p>
          </div>

          {/* Sección de Especificaciones Técnicas */}
          {(specsToShow.length > 0 || Object.keys(variationAttributes).length > 0) && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Especificaciones técnicas
              </h3>
              
              {/* Mostrar medida seleccionada */}
              {selectedVariation?.medida && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg">
                    <span className="text-gray-700">
                      Medida: {selectedVariation.medida}
                    </span>
                  </div>
                </div>
              )}


                {/* Agregar aca el abertura */}
                {/* {selectedVariation?.medida && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg">
                    <span className="text-gray-700">
                      Medida: {selectedVariation.abertura}
                    </span>
                  </div>
                </div>
              )} */}

              {/* Atributos específicos de la variación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* {variationAttributes.longitud && (
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg">
                    <span className="text-gray-700">
                      Longitud: {variationAttributes.longitud} mm
                    </span>
                  </div>
                )} */}
                {variationAttributes.altura && (
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg">
                    <span className="text-gray-700">
                      Altura: {variationAttributes.altura} mm
                    </span>
                  </div>
                )}
                {variationAttributes.calibre && (
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg">
                    <span className="text-gray-700">
                      Calibre: {variationAttributes.calibre}
                    </span>
                  </div>
                )}
                {variationAttributes.material && (
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg">
                    <span className="text-gray-700">
                      Material: {variationAttributes.material}
                    </span>
                  </div>
                )}
                {variationAttributes.color && (
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg">
                    <span className="text-gray-700">
                      Color: {variationAttributes.color}
                    </span>
                  </div>
                )}
              </div>

              {/* Especificaciones técnicas del producto */}
              {specsToShow.length > 0 && (
                <ul className="space-y-3 mt-4">
                  {specsToShow.map((espec, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{espec}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Características principales */}
          {(safeProduct.caracteristicas?.length ?? 0) > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Características principales
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {safeProduct.caracteristicas?.map((caract, index) => (
                  <div
                    key={`${caract}-${index}`}
                    className="flex items-center bg-gray-50 px-4 py-3 rounded-lg transition-colors hover:bg-gray-100"
                  >
                    <Check className="h-5 w-5 text-brand mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{caract}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="hidden md:block mt-8">
            <Link
              href={`/contacto?producto=${encodeURIComponent(
                safeProduct.nombre +
                  (selectedVariation ? ` - ${selectedVariation.medida}` : "")
              )}&codigo=${
                selectedVariation?.codigo || safeProduct.codigoPrincipal
              }`}
              className="inline-flex items-center justify-between bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg transition-all text-sm w-full group"
            >
              <span>¿Interesado en este producto?</span>
              <span className="flex items-center bg-brand rounded px-3 py-1 ml-3 group-hover:bg-brand-dark">
                Contactar
                <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-4 right-4 md:hidden z-50 flex gap-2">
        <Button
          onClick={handleAddToCart}
          className="flex-1 bg-brand hover:bg-brand-dark"
          disabled={isAddedToCart || !product}
        >
          {isAddedToCart ? (
            <Check className="h-5 w-5" />
          ) : (
            <ShoppingCart className="h-5 w-5" />
          )}
          {isAddedToCart ? "Añadido" : "Comprar"}
        </Button>
        <Button asChild className="flex-1">
          <Link
            href={`/contacto?producto=${encodeURIComponent(
              safeProduct.nombre +
                (selectedVariation ? ` - ${selectedVariation.medida}` : "")
            )}&codigo=${
              selectedVariation?.codigo || safeProduct.codigoPrincipal
            }`}
          >
            Consultar
          </Link>
        </Button>
      </div>

      <CartSidebar
        isOpen={showCartSidebar}
        onClose={() => setShowCartSidebar(false)}
      />
      <AddToCartNotification show={showNotification} />
    </div>
  );
}