"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPriceWithUnit } from "@/app/utils/formatUnits";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Check,
  Star,
  ShoppingCart,
  MessageCircle,
} from "lucide-react";
import { useCartStore } from "@/app/components/store/cartStore";
import { useProductStore } from "@/app/components/store/product-store";
import { Button } from "@/app/components/ui/button";
import { CartSidebar } from "@/app/components/CartSideBar/CartSideBar";
import { AddToCartNotification } from "@/app/components/AddToCartNotification/AddToCartNotification";
import { IProduct, IVariation, IProductBase } from "@/types/productTypes";
import { ProductIdSkeleton } from "@/app/components/ProductId/ProductIdSkeleton";

interface ProductImage {
  src: string;
  alt: string;
}

interface ProductIdProps {
  initialProduct?: IProduct;
  initialVariationId?: string;
}

const defaultProduct: IProductBase = {
  _id: "",
  codigoPrincipal: "",
  nombre: "Cargando producto...",
  medida: "",
  categoria: {
    _id: "",
    nombre: "",
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
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  // Obtener categoría directamente del producto (ya viene poblada)
  const category =
    product?.categoria &&
    typeof product.categoria === "object" &&
    "nombre" in product.categoria
      ? product.categoria
      : null;

  // Función para verificar si no hay stock (4 unidades o menos)
  const hasNoStock = (): boolean => {
    if (!product) return false;
    
    // Si tiene variaciones, verificar la variación seleccionada
    if (product.tieneVariaciones && selectedVariation) {
      return selectedVariation.stock !== undefined && selectedVariation.stock <= 4;
    }
    
    // Si no tiene variaciones, verificar el stock del producto base
    return product.stock !== undefined && product.stock <= 4;
  };

  // Función para generar el mensaje de WhatsApp
  const generateWhatsAppMessage = (): string => {
    const productName = product?.nombre || "Producto";
    const variationName = selectedVariation?.nombre ? ` - ${selectedVariation.nombre}` : "";
    const fullProductName = `${productName}${variationName}`;
    
    return encodeURIComponent(`Hola, quisiera saber cuando tengas nuevamente stock del siguiente producto: ${fullProductName}`);
  };

  // Función para abrir WhatsApp con el mensaje preconfigurado
  const openWhatsApp = () => {
    // Reemplaza este número con el número de tu negocio (en formato internacional sin +)
    const phoneNumber = "542984252859";
    const message = generateWhatsAppMessage();
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

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
        setIsFullyLoaded(false);

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
        // Pequeño delay para asegurar que todo esté renderizado
        setTimeout(() => {
          setLoading(false);
          setIsFullyLoaded(true);
        }, 100);
      }
    };

    fetchProduct();
  }, [id, initialProduct, getProductById, setCurrentProduct]);

  // Efecto para marcar cuando todo está completamente cargado
  useEffect(() => {
    if (product && !loading) {
      // Pequeño delay para asegurar que todo esté renderizado
      const timer = setTimeout(() => {
        setIsFullyLoaded(true);
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [product, loading, selectedVariation]);

  const handleAddToCart = () => {
    if (!product || hasNoStock()) return;

    const imagenes = getSafeImages(product);
    const itemToAdd = {
      id: selectedVariation
        ? `${product._id!}-${selectedVariation._id!}`
        : product._id!,
      name:
        product.nombre +
        (selectedVariation ? ` - ${selectedVariation.nombre}` : ""), // Cambiado de medida a nombre
      price: selectedVariation ? selectedVariation.precio : product.precio || 0,
      image: imagenes[0]?.src || "/placeholder-product.jpg",
      variation: selectedVariation
        ? {
            medida: selectedVariation.medida,
            codigo: selectedVariation.codigo,
            nombre: selectedVariation.nombre, // Añadido nombre de variación
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

  const safeProduct: IProductBase = product || defaultProduct;
  const imagenes = getSafeImages(product);
  const specsToShow = safeProduct.especificacionesTecnicas || [];
  const variationAttributes = selectedVariation?.atributos || [];

  console.log("ProductId render:", { product, selectedVariation, variationId, loading, isFullyLoaded });

  // Mostrar skeleton hasta que todo esté completamente cargado
  if (loading || !isFullyLoaded) {
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
    <div className="container mx-auto py-7 px-4 sm:px-6 lg:px-8 mt-[88px] md:mt-0">
      {/* Breadcrumb de navegación */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-brand font-bold hover:text-brandHover transition-colors mb-2"
        >
          <ArrowLeft size={16} className="mr-2" />
          Volver
        </button>

        {/* Breadcrumb: Categoría > Producto > Variación */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:text-brand transition-colors">
            Inicio
          </Link>

          {category && (
            <>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link
                href={`/categoria/${category._id}`}
                className="hover:text-brand transition-colors"
              >
                {category.nombre}
              </Link>
            </>
          )}

          {safeProduct.nombre && (
            <>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-900 font-medium">
                {safeProduct.nombre}
              </span>
            </>
          )}

          {selectedVariation && (
            <>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-900 font-medium">
                {selectedVariation.nombre}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="md:hidden space-y-4 mb-6">
        {safeProduct.destacado && (
          <div className="inline-flex items-center bg-brand/10 text-brand text-sm font-semibold px-3 py-1 rounded-full border border-brand/20">
            <Star className="h-4 w-4 mr-1.5" /> DESTACADO
          </div>
        )}
        
        {/* Cartel de Sin Stock en móvil */}
        {hasNoStock() && (
          <div className="inline-flex items-center bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
            SIN STOCK
          </div>
        )}
        
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {safeProduct.nombre}
          {selectedVariation && ` - ${selectedVariation.nombre}`}{" "}
          {/* Cambiado de medida a nombre */}
        </h1>
        {category && (
          <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
            {category.nombre}
          </span>
        )}
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Sección de imágenes */}
        <div className="flex flex-col lg:flex-row-reverse gap-4 lg:sticky lg:top-32 lg:self-start">
          <div className="w-full">
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={
                  imagenes[imagenPrincipal]?.src || "/placeholder-product.jpg"
                }
                alt={imagenes[imagenPrincipal]?.alt || "Imagen del producto"}
                fill
                className="object-contain p-4"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Cartel de Sin Stock en desktop */}
              {hasNoStock() && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10 shadow">
                  SIN STOCK
                </div>
              )}
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
            
            {/* Cartel de Sin Stock en desktop */}
            {hasNoStock() && (
              <div className="inline-flex items-center bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                SIN STOCK
              </div>
            )}
            
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {safeProduct.nombre}
              {selectedVariation && ` - ${selectedVariation.nombre}`}{" "}
              {/* Cambiado de medida a nombre */}
            </h1>
            {category && (
              <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {category.nombre}
              </span>
            )}
          </div>

          {/* Precio y botón */}
          <div className="space-y-6">
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold text-brand">
                {selectedVariation ? (
                  selectedVariation.medida &&
                  selectedVariation.medida.trim() !== "" ? (
                    // Caso con medida → precio limpio
                    <>
                      $
                      {selectedVariation.precio?.toLocaleString("es-AR", {
                        minimumFractionDigits: 0,
                      })}{" "}
                      <span className="text-sm text-black">+ IVA</span>
                    </>
                  ) : (
                    // Caso sin medida → precio/uMedida
                    <>
                      $
                      {selectedVariation.precio?.toLocaleString("es-AR", {
                        minimumFractionDigits: 0,
                      })}
                      /{selectedVariation.uMedida}{" "}
                      <span className="text-sm text-black">+ IVA</span>
                    </>
                  )
                ) : (
                  // Si no hay variación seleccionada, usar el producto base
                  <>
                    $
                    {safeProduct.precio?.toLocaleString("es-AR", {
                      minimumFractionDigits: 0,
                    })}{" "}
                    {safeProduct.uMedida ? `/${safeProduct.uMedida}` : ""}
                    <span className="text-sm text-black"> + IVA</span>
                  </>
                )}
              </p>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full h-12 text-base font-medium bg-balckHero hover:bg-blackCharcoal"
              disabled={isAddedToCart || !product || hasNoStock()}
            >
              {hasNoStock() ? (
                "SIN STOCK"
              ) : isAddedToCart ? (
                <>
                  <Check className="h-5 w-5 mr-2" /> Añadido al carrito
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" /> Añadir al carrito
                </>
              )}
            </Button>

            {/* Botón de WhatsApp para consultar stock - Solo se muestra cuando no hay stock */}
            {hasNoStock() && (
              <Button
                onClick={openWhatsApp}
                className="w-full h-12 text-base font-medium bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Avísame cuando haya stock
              </Button>
            )}
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
          {specsToShow.length > 0 || variationAttributes.length > 0 ? (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                Especificaciones técnicas
              </h3>

              <div className="space-y-4">
                {/* Atributos principales */}
                <div className="space-y-2">
                  {selectedVariation?.medida ? (
                    <div className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></div>
                      <span className="text-gray-700">
                        <span className="font-medium">Medida:</span>{" "}
                        {selectedVariation.medida}
                      </span>
                    </div>
                  ) : null}

                  {/* Renderizado dinámico de atributos */}
                  {variationAttributes.length > 0 &&
                    variationAttributes.map((atributo, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></div>
                        <span className="text-gray-700">
                          <span className="font-medium capitalize">
                            {atributo.nombre}:
                          </span>{" "}
                          {atributo.valor}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Especificaciones técnicas (checklist) */}
                {specsToShow.length > 0 ? (
                  <div className="pt-2 border-t border-gray-100">
                    <ul className="space-y-2.5">
                      {specsToShow.map((espec, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{espec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

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
                  (selectedVariation ? ` - ${selectedVariation.nombre}` : "") // Cambiado de medida a nombre
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
          className="flex-1 h-12 bg-brand"
          disabled={isAddedToCart || !product || hasNoStock()}
        >
          {hasNoStock() ? (
            "SIN STOCK"
          ) : isAddedToCart ? (
            <Check className="h-5 w-5" />
          ) : (
            <ShoppingCart className="h-5 w-5 text-black" />
          )}
          <span className="ml-2 text-black">
            {hasNoStock() ? "" : isAddedToCart ? "Añadido" : "Comprar"}
          </span>
        </Button>
        
        {/* Botón de WhatsApp para móviles - Solo se muestra cuando no hay stock */}
        {hasNoStock() && (
          <Button 
            onClick={openWhatsApp}
            className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="ml-2">Avisar</span>
          </Button>
        )}
        
        {!hasNoStock() && (
          <Button asChild variant="outline" className="flex-1 h-12">
            <Link
              href={`/contacto?producto=${encodeURIComponent(
                safeProduct.nombre +
                  (selectedVariation ? ` - ${selectedVariation.nombre}` : "") // Cambiado de medida a nombre
              )}&codigo=${
                selectedVariation?.codigo || safeProduct.codigoPrincipal
              }`}
            >
              Consultar
            </Link>
          </Button>
        )}
      </div>

      <CartSidebar
        isOpen={showCartSidebar}
        onClose={() => setShowCartSidebar(false)}
      />
      <AddToCartNotification show={showNotification} />
    </div>
  );
}