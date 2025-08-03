import Link from 'next/link';
import { verifyPayment } from '@/backend/lib/services/mercadoPagoPayment'; // Función que debes crear

export default async function PagoExitoso({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h1>
        <p className="text-gray-600 mb-6">Tu pago ha sido procesado correctamente. Número de transacción: {paymentId}</p>
        
        {/* <div className="mb-6 p-4 bg-green-50 rounded-md text-left">
          <h2 className="font-semibold mb-2">Detalles del pago:</h2>
          <pre className="text-sm text-gray-700">{JSON.stringify(paymentStatus, null, 2)}</pre>
        </div> */}

        <Link href="/mis-ordenes" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition duration-300">
          Ver mis órdenes
        </Link>
      </div>
    </div>
  );
}