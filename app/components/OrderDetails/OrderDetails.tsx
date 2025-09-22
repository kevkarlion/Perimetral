// components/OrderDetails.tsx
'use client';

import { useEffect, useState } from 'react';
import { IOrder } from '@/types/orderTypes';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import OrderDetailsSkeleton from './OrderDetailsSkeleton';

interface OrderDetailsProps {
  token: string;
}

export default function OrderDetails({ token }: OrderDetailsProps) {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${token}`);
        const data = await response.json();

        if (!response.ok || !data.orderNumber) {
          throw new Error(data.error || 'No se pudo cargar la orden');
        }

        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [token]);

  if (loading) {
    return <OrderDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Orden no encontrada</h2>
        <p className="mt-2 text-gray-600">
          No se encontró una orden con ese token de acceso.
        </p>
      </div>
    );
  }

  // 🔹 Forzar que si es efectivo, se considere completado
  const effectiveStatus =
    order.paymentMethod === 'cash' ? 'completed' : order.status;

  // Función para traducir estados de pago
  const translatePaymentStatus = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      case 'refunded':
        return 'Reembolsado';
      default:
        return 'Pendiente';
    }
  };

  // Color según estado de pago
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'refunded':
        return 'text-purple-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden my-6">
      <div className="p-6 bg-gray-50 border-b">
        <h1 className="text-2xl font-bold text-gray-800">
          Orden #{order.orderNumber}
        </h1>
        <div className="flex items-center mt-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              effectiveStatus === 'completed'
                ? 'bg-green-100 text-green-800'
                : effectiveStatus === 'cancelled'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {effectiveStatus === 'completed'
              ? 'Completado'
              : effectiveStatus === 'cancelled'
              ? 'Cancelado'
              : 'Pendiente'}
          </span>
          <span className="ml-4 text-sm text-gray-500">
            {format(new Date(order.createdAt), 'PPPp', { locale: es })}
          </span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Información del cliente
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Nombre</p>
              <p className="text-sm font-medium">{order.customer.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium">{order.customer.email}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Detalles del pago
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Método de pago</p>
              <p className="text-sm font-medium capitalize">
                {order.paymentMethod}
              </p>
            </div>
          
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-sm font-medium">
                ${order.total.toLocaleString('es-AR')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Productos ({order.items.length})
        </h2>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-start">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded object-cover mr-4"
                />
              )}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {item.name}
                </h3>
                {item.medida && (
                  <p className="text-xs text-gray-500 mt-1">{item.medida}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-900">
                  ${item.price.toLocaleString('es-AR')} x {item.quantity}
                </p>
                <p className="text-sm font-medium mt-1">
                  ${(item.price * item.quantity).toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
