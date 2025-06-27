'use client'

import { Button } from "@/components/ui/button";
import { X, ChevronLeft, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

//componente de persistencia de datos
//es un objeto que contiene los datos del carrito
//y los metodos para manipularlos
import { useCartStore } from "@/components/store/cartStore";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const {
    items: cartItems,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice
  } = useCartStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const subtotal = getTotalPrice();
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleCheckout = async () => {
  if (cartItems.length === 0) return;
  
  // Validar datos del cliente
  if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
    setError('Por favor complete todos los campos requeridos');
    return;
  }

  setIsProcessing(true);
  setError(null);
  
  try {
    // Transformar los items del carrito al formato esperado por el backend
    const formattedItems = cartItems.map(item => {
      // Extraer el ID base y la variación (si existe)
      const [baseProductId, variationId] = item.id.includes('-') 
        ? item.id.split('-') 
        : [item.id, null];

      return {
        productId: baseProductId,
        variationId: variationId || undefined,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || undefined
      };
    });


    //realizo la petición al backend para crear la orden
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: formattedItems, // Enviamos los items transformados
        total,
        customerInfo
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al procesar la orden');
    }

    const { orderId, checkoutUrl } = await response.json();
    
    // Redirigir a Mercado Pago o página de éxito
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      router.push(`/checkout/success?orderId=${orderId}`);
    }
    
  } catch (err) {
    console.error('Error en el checkout:', err);
    
    // Mostrar mensajes de error específicos
    if (err instanceof Error) {
      if (err.message.includes('Stock insuficiente')) {
        setError('Algunos productos no tienen suficiente stock. Por favor ajusta tu carrito.');
      } else {
        setError(err.message || 'Ocurrió un error al procesar tu pago');
      }
    } else {
      setError('Ocurrió un error desconocido');
    }
  } finally {
    setIsProcessing(false);
  }
};
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Tu <span className="text-brand">Carrito</span>
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-500 md:text-lg">
            Revisa tus productos antes de finalizar la compra
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Lista de productos */}
            {cartItems.length > 0 ? (
              <>
                <div className="hidden md:grid grid-cols-12 gap-4 mb-4 pb-2 border-b border-gray-200">
                  <div className="col-span-5 font-medium text-gray-700">Producto</div>
                  <div className="col-span-2 font-medium text-gray-700 text-center">Precio</div>
                  <div className="col-span-3 font-medium text-gray-700 text-center">Cantidad</div>
                  <div className="col-span-2 font-medium text-gray-700 text-right">Total</div>
                </div>

                {cartItems.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  const nameParts = item.name.split(' - ');
                  const baseName = nameParts[0];
                  const medida = nameParts.length > 1 ? nameParts[1] : item.medida;
                  
                  return (
                    <div key={`${item.id}-${item.medida || ''}`} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-200 group">
                      <div className="col-span-6 md:col-span-5 flex items-center">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="mr-3 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{baseName}</h3>
                          {medida && <p className="text-xs text-gray-500">{medida}</p>}
                        </div>
                      </div>

                      <div className="col-span-2 text-center hidden md:block">
                        <span className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      <div className="col-span-4 md:col-span-3 flex items-center justify-center">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-6 md:col-span-2 flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-900 md:hidden">
                          {formatPrice(itemTotal)}
                          <span className="block text-xs text-gray-500">
                            {formatPrice(item.price)} c/u
                          </span>
                        </span>
                        <span className="text-sm font-medium text-gray-900 hidden md:block">
                          {formatPrice(itemTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="py-12 text-center">
                <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
                <Link href="/catalogo" className="text-brand hover:text-brandHover font-medium">
                  Ir al catálogo
                </Link>
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="mt-8">
                <Link href="/catalogo" className="flex items-center text-brand hover:text-brandHover font-medium">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Seguir comprando
                </Link>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Datos del cliente</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo*</label>
                    <input
                      type="text"
                      name="name"
                      value={customerInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono*</label>
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                    <input
                      type="text"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen del pedido</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA (21%)</span>
                    <span className="font-medium">{formatPrice(iva)}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <span className="text-gray-900 font-bold">Total</span>
                    <span className="text-gray-900 font-bold">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full bg-brand hover:bg-brandHover text-white py-3"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : (
                    'Finalizar compra'
                  )}
                </Button>

                <div className="mt-4 text-xs text-gray-500">
                  <p>* Los gastos de envío se calcularán al finalizar la compra.</p>
                  <p>* Precios incluyen IVA cuando corresponda.</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Métodos de pago</h3>
                <div className="grid grid-cols-3 gap-2">
                  {['visa', 'mastercard', 'amex', 'mercado-pago', 'transferencia', 'efectivo'].map((method) => (
                    <div key={method} className="p-2 border border-gray-200 rounded-md flex items-center justify-center">
                      <Image
                        src={`/payment-methods/${method}.svg`}
                        alt={method}
                        width={40}
                        height={30}
                        className="h-6 w-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}