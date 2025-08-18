'use client'
import Link from 'next/link';
import { verifyPayment } from '@/backend/lib/services/mercadoPagoPayment'; // Función que debes crear

import { useEffect } from 'react';
import { useCartStore } from '@/app/components/store/cartStore'

export default async function PagoExitoso({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {


    const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart(); // Vacía el carrito al llegar a esta página
  }, [clearCart]);


  const paymentId = searchParams.payment_id as string;
  const paymentStatus = await verifyPayment(paymentId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-green-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Completado con Éxito!</h1>
        <p className="text-gray-600 mb-4">Tu transacción se ha procesado correctamente.</p>
        <p className="text-gray-600 mb-6">ID de transacción: <span className="font-mono text-gray-800">{paymentId}</span></p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Hemos enviado un correo electrónico con los detalles de tu compra. 
                Por favor revisa tu bandeja de entrada (y la carpeta de spam si no lo encuentras).
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Si tienes alguna pregunta, no dudes en contactar a nuestro equipo de soporte.
        </p>
      </div>
    </div>
  );
}