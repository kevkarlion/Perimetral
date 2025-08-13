"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
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
  categoria: {
    _id: "",
    nombre: ''
  },
  descripcionCorta: "",
  tieneVariaciones: false,
  variaciones: [],
};

export default function ProductId({
  initialProduct,
  initialVariationId,
}: ProductIdProps) {
  const router = useRouter();
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

        const response = await fetch(`${process.env.BASE_URL}/api/stock/${id}`);

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
        ? `${product._id!}-${selectedVariation._id!}`
        : product._id!,
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
          <button
            onClick={() => router.back()}
            className="flex items-center text-brand font-bold hover:text-brandHover transition-colors mb-8"
          >
            <ArrowLeft size={16} className="mr-2" />
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-24 md:pb-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-brand font-bold hover:text-brandHover transition-colors mb-8"
        >
          <ArrowLeft size={16} className="mr-2" />
          Volver
        </button>
      </div>

      <div className="md:hidden space-y-4 mb-6">
        {safeProduct.destacado && (
          <div className="inline-flex items-center bg-brand/10 text-brand text-sm font-semibold px-3 py-1 rounded-full border border-brand/20">
            <Star className="h-4 w-4 mr-1.5" /> DESTACADO
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {safeProduct.nombre}
          {selectedVariation && ` - ${selectedVariation.medida}`}
        </h1>
        {safeProduct.categoria && (
          <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
            {safeProduct.categoria.nombre}
          </span>
        )}
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Sección de imágenes */}
        <div className="flex flex-col lg:flex-row-reverse gap-4 lg:sticky lg:top-32 lg:self-start">
          <div className="w-full">
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={imagenes[imagenPrincipal]?.src || "/placeholder-product.jpg"}
                alt={imagenes[imagenPrincipal]?.alt || "Imagen del producto"}
                fill
                className="object-contain p-4"
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
                className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 relative rounded-md overflow-hidden border transition-all ${
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

        {/* Sección de detalles */}
        <div className="space-y-8">
          <div className="hidden md:block space-y-4">
            {safeProduct.destacado && (
              <div className="inline-flex items-center bg-brand/10 text-brand text-sm font-semibold px-3 py-1 rounded-full border border-brand/20">
                <Star className="h-4 w-4 mr-1.5" /> DESTACADO
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {safeProduct.nombre}
              {selectedVariation && ` - ${selectedVariation.medida}`}
            </h1>
            {safeProduct.categoria && (
              <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {safeProduct.categoria.nombre}
              </span>
            )}
          </div>

          {/* Precio y botón */}
          <div className="space-y-6">
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold text-brand">
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
              className="w-full h-12 text-base font-medium bg-balckHero hover:bg-blackCharcoal"
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

          {/* Descripción */}
          <div className="prose max-w-none text-gray-700">
            <p className="text-gray-600 leading-relaxed">
              {selectedVariation?.descripcion ||
                safeProduct.descripcionLarga ||
                safeProduct.descripcionCorta ||
                "Descripción no disponible"}
            </p>
          </div>

          {/* Especificaciones técnicas */}
          {(specsToShow.length > 0 || Object.keys(variationAttributes).length > 0) && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Especificaciones técnicas
              </h3>
              
              {selectedVariation?.medida && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                    <span className="text-gray-700 font-medium">
                      Medida: <span className="text-brand">{selectedVariation.medida}</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Atributos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {variationAttributes.altura && (
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                    <span className="text-gray-700 font-medium">
                      Altura: <span className="text-brand">{variationAttributes.altura} mm</span>
                    </span>
                  </div>
                )}
                {variationAttributes.calibre && (
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                    <span className="text-gray-700 font-medium">
                      Calibre: <span className="text-brand">{variationAttributes.calibre}</span>
                    </span>
                  </div>
                )}
                {variationAttributes.material && (
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                    <span className="text-gray-700 font-medium">
                      Material: <span className="text-brand">{variationAttributes.material}</span>
                    </span>
                  </div>
                )}
                {variationAttributes.color && (
                  <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                    <span className="text-gray-700 font-medium">
                      Color: <span className="text-brand">{variationAttributes.color}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Especificaciones */}
              {specsToShow.length > 0 && (
                <ul className="space-y-3">
                  {specsToShow.map((espec, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-brand mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{espec}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Características principales */}
          {(safeProduct.caracteristicas?.length ?? 0) > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Características principales
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {safeProduct.caracteristicas?.map((caract, index) => (
                  <div
                    key={`${caract}-${index}`}
                    className="flex items-center bg-gray-50 px-4 py-3 rounded-lg border border-gray-100"
                  >
                    <Check className="h-5 w-5 text-brand mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{caract}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contacto (desktop) */}
          <div className="hidden md:block mt-8">
            <Link
              href={`/contacto?producto=${encodeURIComponent(
                safeProduct.nombre +
                  (selectedVariation ? ` - ${selectedVariation.medida}` : "")
              )}&codigo=${
                selectedVariation?.codigo || safeProduct.codigoPrincipal
              }`}
              className="inline-flex items-center justify-between bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-all w-full group"
            >
              <span className="text-sm">¿Interesado en este producto?</span>
              <span className="flex items-center bg-brand rounded px-3 py-1.5 ml-3 group-hover:bg-brand-dark text-sm">
                Contactar
                <ChevronRight className="h-4 w-4 ml-1" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Botones móviles */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-50 flex gap-3">
        <Button
          onClick={handleAddToCart}
          className="flex-1 h-12"
          disabled={isAddedToCart || !product}
        >
          {isAddedToCart ? (
            <Check className="h-5 w-5" />
          ) : (
            <ShoppingCart className="h-5 w-5" />
          )}
          <span className="ml-2">{isAddedToCart ? "Añadido" : "Comprar"}</span>
        </Button>
        <Button asChild variant="outline" className="flex-1 h-12">
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