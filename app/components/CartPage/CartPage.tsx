"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { X, ChevronLeft, Plus, Minus, Loader2, CreditCard, DollarSign } from "lucide-react";
import { useCartStore } from "@/app/components/store/cartStore";

export default function CartPage() {
  const router = useRouter();
  const {
    items: cartItems,
    removeItem,
    updateQuantity,
    getTotalPrice,
    startCheckout,
    endCheckout,
  } = useCartStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"mercadopago" | "efectivo">("mercadopago");
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const subtotal = getTotalPrice();
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(price);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      setError("Por favor complete nombre, email y teléfono");
      return;
    }

    setIsProcessing(true);
    setError(null);
    startCheckout(); // activamos flag de checkout

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.productId,
            variationId: item.variationId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            medida: item.medida,
          })),
          total,
          customer: customerInfo,
          paymentMethod: selectedPaymentMethod,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al procesar el pedido");
      }

      const orderData = await res.json();

      // Lógica de redirección según método de pago
      if (selectedPaymentMethod === "efectivo") {
        // Redirige a la página de pago pendiente
        window.location.href = `/pago-pendiente/efectivo?orderNumber=${orderData.orderNumber}&total=${orderData.total}&token=${orderData.accessToken}`;
      } else if (orderData.paymentUrl) {
        // Redirige a Mercado Pago
        window.location.href = orderData.paymentUrl;
      } else {
        router.push(`/order/${orderData.accessToken}`);
      }
    } catch (err: any) {
      setError(err.message || "Error al procesar tu pedido");
      setIsProcessing(false);
      console.error("Checkout error:", err);
      endCheckout();
    }
  };

  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 mt-[40px] md:mt-0">
        <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-3 text-center">
          Tu <span className="text-brand">Carrito</span>
        </h2>
        <p className="text-gray-600 text-sm md:text-lg text-center mb-8 md:mb-12">
          Revisa tus productos antes de finalizar la compra
        </p>

        {error && (
          <div className="mb-4 md:mb-6 p-3 bg-red-100 text-red-700 rounded-lg border border-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {cartItems.length === 0 ? (
              <div className="py-8 md:py-12 text-center bg-white rounded-lg shadow-sm">
                <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
                <Link href="/catalogo" className="text-brand font-medium text-sm md:text-base hover:text-brandHover">
                  Ir al catálogo
                </Link>
              </div>
            ) : (
              <>
                {/* Cabecera */}
                <div className="hidden md:grid grid-cols-12 gap-4 mb-4 pb-2 border-b border-gray-200">
                  <div className="col-span-5 font-medium text-gray-800">Producto</div>
                  <div className="col-span-2 font-medium text-gray-800 text-center">Precio</div>
                  <div className="col-span-3 font-medium text-gray-800 text-center">Cantidad</div>
                  <div className="col-span-2 font-medium text-gray-800 text-right">Total</div>
                </div>

                {cartItems.map((item) => {
                  const itemTotal = item.price * item.quantity;
                  return (
                    <div key={item.id} className="grid grid-cols-12 gap-3 md:gap-4 items-center py-4 border-b border-gray-200 bg-white rounded-lg px-3 md:px-4 shadow-sm">
                      <div className="col-span-6 md:col-span-5 flex items-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="mr-2 md:mr-3 text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
                        >
                          <X className="h-3 w-3 md:h-4 md:w-4" />
                        </button>
                        <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-md overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                          {item.image && <Image src={item.image} alt={item.name} fill className="object-contain p-1" />}
                        </div>
                        <div className="ml-3 md:ml-4 min-w-0">
                          <h3 className="text-xs md:text-sm font-medium text-gray-900 line-clamp-2 md:line-clamp-1">{item.name}</h3>
                          {item.medida && <p className="text-xs text-gray-500 mt-1">{item.medida}</p>}
                          <div className="mt-1 md:hidden">
                            <span className="text-xs font-medium text-gray-800">{formatPrice(item.price)} c/u</span>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 text-center hidden md:block">
                        <span className="text-sm font-medium text-gray-800">{formatPrice(item.price)}</span>
                      </div>

                      <div className="col-span-4 md:col-span-3 flex items-center justify-center">
                        <div className="flex items-center border border-gray-300 rounded-md bg-gray-50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
                          >
                            <Minus className="h-3 w-3 md:h-4 md:w-4" />
                          </button>
                          <span className="px-2 md:px-3 py-1 text-xs md:text-sm font-medium text-gray-800 min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-3 w-3 md:h-4 md:w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-6 md:col-span-2 flex flex-col items-end">
                        <span className="text-sm font-medium text-gray-800">{formatPrice(itemTotal)}</span>
                        <span className="text-xs text-gray-500 hidden md:block mt-1">{formatPrice(item.price)} c/u</span>
                      </div>
                    </div>
                  );
                })}

                <div className="mt-6 md:mt-8">
                  <Link href="/catalogo" className="flex items-center text-brand font-medium text-sm md:text-base hover:text-brandHover">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Seguir comprando
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Resumen y datos del cliente */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1 space-y-4 md:space-y-6">
              {/* Datos cliente */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 md:mb-4">Datos del cliente</h3>
                <div className="space-y-3 md:space-y-4">
                  {["name", "email", "phone", "address"].map((field) => (
                    <div key={field}>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                        {field === "name" ? "Nombre completo*" : field === "phone" ? "Teléfono*" : field === "email" ? "Email*" : "Dirección"}
                      </label>
                      <input
                        type={field === "email" ? "email" : "text"}
                        name={field}
                        value={customerInfo[field as keyof typeof customerInfo]}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                        required={field !== "address"}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Método de pago */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 md:mb-4">Método de pago</h3>
                <div className="space-y-2 md:space-y-3">
                  <div
                    className={`border rounded-lg p-3 md:p-4 cursor-pointer transition-all ${selectedPaymentMethod === "mercadopago" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                    onClick={() => setSelectedPaymentMethod("mercadopago")}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 mr-2 md:mr-3 bg-gray-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                      </div>
                      <div>
                        <span className="font-medium text-sm md:text-base">Mercado Pago</span>
                        <p className="text-xs text-gray-500">Tarjeta de crédito/débito o transferencia</p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-3 md:p-4 cursor-pointer transition-all ${selectedPaymentMethod === "efectivo" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                    onClick={() => setSelectedPaymentMethod("efectivo")}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 mr-2 md:mr-3 bg-gray-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                      </div>
                      <div>
                        <span className="font-medium text-sm md:text-base">Pago en Efectivo</span>
                        <p className="text-xs text-gray-500">Abonás al retirar en nuestro local</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumen */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 md:p-6 sticky bottom-0 md:static">
                <h3 className="text-lg font-bold text-gray-800 mb-3 md:mb-4">Resumen del pedido</h3>
                <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                  <div className="flex justify-between"><span className="text-gray-600 text-sm md:text-base">Subtotal</span><span className="font-medium text-gray-800 text-sm md:text-base">{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600 text-sm md:text-base">IVA (21%)</span><span className="font-medium text-gray-800 text-sm md:text-base">{formatPrice(iva)}</span></div>
                  <div className="flex justify-between pt-3 md:pt-4 border-t border-gray-200"><span className="text-gray-900 font-bold text-sm md:text-base">Total</span><span className="text-gray-900 font-bold text-sm md:text-base">{formatPrice(total)}</span></div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 flex items-center justify-center gap-2 rounded-md shadow-sm transition text-sm md:text-base"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {selectedPaymentMethod === "efectivo" ? "Procesando pedido..." : "Redirigiendo a pago..."}
                    </span>
                  ) : selectedPaymentMethod === "efectivo" ? (
                    <><DollarSign className="h-4 w-4 md:h-5 md:w-5" /><span className="text-xs md:text-sm">Confirmar pedido para pago en efectivo</span></>
                  ) : (
                    <><Image src="/payment-methods/mercado-pago.svg" alt="Mercado Pago" width={64} height={20} className="object-contain" /><span className="text-xs md:text-sm">Pagar con Mercado Pago</span></>
                  )}
                </Button>

                <div className="mt-3 text-xs text-gray-500">
                  <p>* Los gastos de envío se calcularán al finalizar la compra.</p>
                  <p>* Precios incluyen IVA cuando corresponda.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
