// components/OrderDetailsSkeleton.tsx
export default function OrderDetailsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden my-6 animate-pulse">
      {/* Encabezado */}
      <div className="p-6 bg-gray-50 border-b">
        <div className="h-7 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="flex items-center mt-2">
          <div className="h-6 bg-gray-300 rounded-full w-24"></div>
          <div className="ml-4 h-4 bg-gray-300 rounded w-32"></div>
        </div>
      </div>

      {/* Información del cliente y detalles de pago */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información del cliente */}
        <div>
          <div className="h-6 bg-gray-300 rounded w-2/3 mb-4"></div>
          <div className="space-y-3">
            <div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        {/* Detalles del pago */}
        <div>
          <div className="h-6 bg-gray-300 rounded w-2/3 mb-4"></div>
          <div className="space-y-3">
            <div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos */}
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-start">
              <div className="w-16 h-16 bg-gray-300 rounded mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
              <div className="text-right">
                <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}