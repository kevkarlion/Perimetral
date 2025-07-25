'use client'

import { Button } from "@/app/components/ui/button";
import { X, ChevronLeft, Plus, Minus, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

//componente de persistencia de datos
//es un objeto que contiene los datos del carrito
//y los metodos para manipularlos
import { useCartStore } from "@/app/components/store/cartStore";

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


// Actualiza tu handleCheckout
const handleCheckout = async () => {
  if (cartItems.length === 0) return;

  // Validación mejorada
  if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
    setError('Por favor complete nombre, email y teléfono');
    return;
  }

  setIsProcessing(true);
  setError(null);

  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems.map(item => ({
           productId: item.id.split('-')[0],
          // Solo incluir variationId si el ID contiene un guión (indica que tiene variación)
          ...(item.id.includes('-') && { variationId: item.id.split('-')[1] }),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || undefined,
          medida: item.medida // Asegúrate de incluir la medida si existe
        })),
        total, // Envía el total con IVA incluido
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address || ''
        },
        paymentMethod: 'mercadopago'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Error al procesar el pago');
    }

    const orderData = await response.json();
    console.log('Order created:', orderData);
    console.log('Payment URL:', orderData.paymentUrl);
    debugger
  
    // Redirigir a Mercado Pago si existe paymentUrl
    if (orderData.paymentUrl) {
      window.location.href = orderData.paymentUrl;
    } else {
      // Redirigir a página de confirmación si es otro método
      router.push(`/order/${orderData._id}`);
    }

  } catch (err: any) {
    setError(err.message || 'Error al procesar tu pago. Intenta nuevamente.');
    console.error('Checkout error:', err);
  } finally {
    setIsProcessing(false);
  }
};

  return (
  <section className="py-16 bg-gray-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Tu <span className="text-blue-600">Carrito</span>
        </h2>
        <p className="max-w-[700px] mx-auto text-gray-600 md:text-lg">
          Revisa tus productos antes de finalizar la compra
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Lista de productos */}
          {cartItems.length > 0 ? (
            <>
              <div className="hidden md:grid grid-cols-12 gap-4 mb-4 pb-2 border-b border-gray-200">
                <div className="col-span-5 font-medium text-gray-800">Producto</div>
                <div className="col-span-2 font-medium text-gray-800 text-center">Precio</div>
                <div className="col-span-3 font-medium text-gray-800 text-center">Cantidad</div>
                <div className="col-span-2 font-medium text-gray-800 text-right">Total</div>
              </div>

              {cartItems.map((item) => {
                const itemTotal = item.price * item.quantity;
                const nameParts = item.name.split(' - ');
                const baseName = nameParts[0];
                const medida = nameParts.length > 1 ? nameParts[1] : item.medida;
                
                return (
                  <div key={`${item.id}-${item.medida || ''}`} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-200 bg-white rounded-lg px-4">
                    <div className="col-span-6 md:col-span-5 flex items-center">
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="mr-3 text-gray-500 hover:text-red-500 transition-colors"
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
                      <span className="text-sm font-medium text-gray-800">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <div className="col-span-4 md:col-span-3 flex items-center justify-center">
                      <div className="flex items-center border border-gray-300 rounded-md bg-gray-50">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium text-gray-800">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-6 md:col-span-2 flex flex-col items-end">
                      <span className="text-sm font-medium text-gray-800 md:hidden">
                        {formatPrice(itemTotal)}
                        <span className="block text-xs text-gray-500">
                          {formatPrice(item.price)} c/u
                        </span>
                      </span>
                      <span className="text-sm font-medium text-gray-800 hidden md:block">
                        {formatPrice(itemTotal)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <div className="py-12 text-center bg-white rounded-lg shadow-sm">
              <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
              <Link href="/catalogo" className="text-blue-600 hover:text-blue-800 font-medium">
                Ir al catálogo
              </Link>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="mt-8">
              <Link href="/catalogo" className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Seguir comprando
              </Link>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Datos del cliente</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo*</label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen del pedido</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (21%)</span>
                  <span className="font-medium text-gray-800">{formatPrice(iva)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <span className="text-gray-900 font-bold">Total</span>
                  <span className="text-gray-900 font-bold">{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isProcessing || cartItems.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-center gap-2 rounded-md shadow-sm transition"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Redirigiendo a Mercado Pago...
                  </span>
                ) : (
                  <>
                    <Image 
                      src="/payment-methods/mercado-pago.svg" 
                      alt="Mercado Pago" 
                      width={20} 
                      height={20} 
                    />
                    Pagar con Mercado Pago
                  </>
                )}
              </Button>

              <div className="mt-4 text-xs text-gray-500">
                <p>* Los gastos de envío se calcularán al finalizar la compra.</p>
                <p>* Precios incluyen IVA cuando corresponda.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Métodos de pago</h3>
              <div className="grid grid-cols-3 gap-2">
                {['visa', 'mastercard', 'amex', 'mercado-pago', 'transferencia', 'efectivo'].map((method) => (
                  <div key={method} className="p-2 border border-gray-200 rounded-md flex items-center justify-center bg-gray-50">
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