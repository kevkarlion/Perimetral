'use client'

import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/components/store/cartStore";

export default function CartPage() {
  // Obtenemos los datos y acciones del store
  const {
    items: cartItems,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice
  } = useCartStore();

  // Función para formatear precios
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Cálculos del carrito usando el store
  const subtotal = getTotalPrice();
  const iva = subtotal * 0.21;
  const total = subtotal + iva;

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Tu <span className="text-brand">Carrito</span>
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-500 md:text-lg">
            Revisa tus productos antes de finalizar la compra
          </p>
        </div>

        {/* Contenido principal */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            {/* Encabezado de la tabla */}
            <div className="hidden md:grid grid-cols-12 gap-4 mb-4 pb-2 border-b border-gray-200">
              <div className="col-span-5 font-medium text-gray-700">Producto</div>
              <div className="col-span-2 font-medium text-gray-700 text-center">Precio</div>
              <div className="col-span-3 font-medium text-gray-700 text-center">Cantidad</div>
              <div className="col-span-2 font-medium text-gray-700 text-right">Total</div>
            </div>

            {/* Items del carrito */}
            {cartItems.map((item) => {
              const itemTotal = item.price * item.quantity;
              // Extraer el nombre base y la medida si existe
              const nameParts = item.name.split(' - ');
              const baseName = nameParts[0];
              const medida = nameParts.length > 1 ? nameParts[1] : item.medida;
              
              return (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-200 group">
                  {/* Producto */}
                  <div className="col-span-6 md:col-span-5 flex items-center">
                    <button 
                      className="mr-3 text-gray-400 hover:text-red-500 transition-colors"
                      onClick={() => removeItem(item.id)}
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
                      {medida && (
                        <p className="text-xs text-gray-500">{medida}</p>
                      )}
                    </div>
                  </div>

                  {/* Precio unitario */}
                  <div className="col-span-2 text-center hidden md:block">
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  {/* Cantidad */}
                  <div className="col-span-4 md:col-span-3 flex items-center justify-center">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                      <button 
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Total y precio en móvil */}
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

            {/* Continuar comprando */}
            <div className="mt-8">
              <Link href="/catalogo" className="flex items-center text-brand hover:text-brandHover font-medium">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Seguir comprando
              </Link>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
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
                className="w-full bg-brand hover:bg-brandHover text-white py-3"
                disabled={cartItems.length === 0}
              >
                Finalizar compra
              </Button>

              <div className="mt-4 text-xs text-gray-500">
                <p>* Los gastos de envío se calcularán al finalizar la compra.</p>
                <p>* Precios incluyen IVA cuando corresponda.</p>
              </div>
            </div>

            {/* Métodos de pago */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm p-6">
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
        </div>
      </div>
    </section>
  );
}