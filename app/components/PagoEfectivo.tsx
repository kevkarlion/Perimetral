'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCartStore } from '@/app/components/store/cartStore';
import { useSearchParams } from 'next/navigation';

export default function PagoPendienteEfectivoComponent() {
  const clearCart = useCartStore((state) => state.clearCart);
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const total = searchParams.get('total');
  const token = searchParams.get('token');

  useEffect(() => {
    clearCart(); // Vacía el carrito al llegar a esta página
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-16 sm:p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-yellow-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pedido Registrado con Éxito!</h1>
        <p className="text-gray-600 mb-4">Tu pedido ha sido registrado correctamente y está pendiente de pago.</p>

        {orderNumber && (
          <p className="text-gray-600 mb-2">
            Número de orden: <span className="font-mono text-gray-800">{orderNumber}</span>
          </p>
        )}

        {total && (
          <p className="text-gray-600 mb-6">
            Total a pagar: <span className="font-mono text-gray-800">${parseFloat(total).toFixed(2)}</span>
          </p>
        )}

        {/* Instrucciones de pago */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 text-left">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 font-semibold">Para completar tu compra:</p>
              <ul className="text-sm text-yellow-700 mt-1 list-disc pl-5 space-y-1">
                <li>Contactanos para completar el pedido</li>
                <li>Horario: Lunes a Viernes de 8:00 a 18:00</li>
                <li>Menciona tu número de orden al pagar</li>
                <li>Tu pedido se preparará una vez confirmado el pago</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Hemos enviado un correo electrónico con los detalles de tu pedido y las instrucciones para el pago.
              </p>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/catalogo"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Seguir Comprando
          </Link>
          
          {token && (
            <Link
              href={`/order/${token}`}
              className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Ver Mi Orden
            </Link>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Si tienes alguna pregunta, no dudes en contactar a nuestro equipo de soporte.
        </p>
      </div>
    </div>
  );
}
