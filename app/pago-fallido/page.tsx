import Link from 'next/link';

export default function PagoFallido({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const errorMessage = searchParams.message || 'No se pudo completar el pago';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Pago Fallido</h1>
        <p className="text-gray-600 mb-6">{errorMessage}</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/carrito" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition duration-300">
            Volver al carrito
          </Link>
          <Link href="/contacto" className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-md transition duration-300">
            Contactar soporte
          </Link>
        </div>
      </div>
    </div>
  );
}