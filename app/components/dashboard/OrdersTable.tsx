'use client'

import { useEffect, useState } from 'react'
import React from 'react';
import { IOrder } from '@/types/orderTypes'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronDown, ChevronUp, Clipboard, ClipboardCheck } from 'lucide-react'

export default function OrdersTable() {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [copiedFields, setCopiedFields] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders')
        // console.log('Response status:', response)
        if (!response.ok) {
          throw new Error('Error al cargar las órdenes')
        }
        const data = await response.json()
        // console.log('Orders data:', data)
        setOrders(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const copyToClipboard = async (text: string, field: string) => {
    if (!text) return
    
    try {
      await navigator.clipboard.writeText(text)
      setCopiedFields({ [field]: true })
      setTimeout(() => setCopiedFields(prev => ({ ...prev, [field]: false })), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order._id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      {order.customer.phone || 'Sin teléfono'}
                      {order.customer.phone && (
                        <button 
                          onClick={() => copyToClipboard(order.customer.phone || '', `phone-${order._id}`)}
                          className="text-gray-400 hover:text-brand"
                        >
                          {copiedFields[`phone-${order._id}`] ? (
                            <ClipboardCheck className="h-4 w-4" />
                          ) : (
                            <Clipboard className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items.length} producto(s)
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items[0]?.name}
                      {order.items.length > 1 && ` y ${order.items.length - 1} más`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total.toLocaleString('es-AR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status === 'completed' ? 'Completado' : 
                      order.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.createdAt), 'dd MMM yyyy', { locale: es })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleExpand(order._id)}
                      className="text-brand hover:text-brand-dark"
                    >
                      {expandedOrder === order._id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedOrder === order._id && (
                  <tr className="bg-gray-50">
                    <td colSpan={8} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Información del Cliente</h4>
                          <div className="space-y-2">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 w-24">Nombre:</span>
                              <span className="text-sm font-medium">{order.customer.name}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 w-24">Email:</span>
                              <span className="text-sm font-medium flex items-center gap-1">
                                {order.customer.email}
                                <button 
                                  onClick={() => copyToClipboard(order.customer.email, `email-${order._id}`)}
                                  className="text-gray-400 hover:text-brand"
                                >
                                  {copiedFields[`email-${order._id}`] ? (
                                    <ClipboardCheck className="h-4 w-4" />
                                  ) : (
                                    <Clipboard className="h-4 w-4" />
                                  )}
                                </button>
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500 w-24">Teléfono:</span>
                              <span className="text-sm font-medium flex items-center gap-1">
                                {order.customer.phone || 'No proporcionado'}
                                {order.customer.phone && (
                                  <button 
                                    onClick={() => copyToClipboard(order.customer.phone || '', `phone-${order._id}`)}
                                    className="text-gray-400 hover:text-brand"
                                  >
                                    {copiedFields[`phone-${order._id}`] ? (
                                      <ClipboardCheck className="h-4 w-4" />
                                    ) : (
                                      <Clipboard className="h-4 w-4" />
                                    )}
                                  </button>
                                )}
                              </span>
                            </div>
                            <div className="flex items-start">
                              <span className="text-sm text-gray-500 w-24">Dirección:</span>
                              <span className="text-sm font-medium flex items-center gap-1">
                                {order.customer.address || 'No proporcionada'}
                                {order.customer.address && (
                                  <button 
                                    onClick={() => copyToClipboard(order.customer.address || '', `address-${order._id}`)}
                                    className="text-gray-400 hover:text-brand"
                                  >
                                    {copiedFields[`address-${order._id}`] ? (
                                      <ClipboardCheck className="h-4 w-4" />
                                    ) : (
                                      <Clipboard className="h-4 w-4" />
                                    )}
                                  </button>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Detalles del Pedido</h4>
                          <div className="space-y-2">
                            <div className="flex">
                              <span className="text-sm text-gray-500 w-24">Método de pago:</span>
                              <span className="text-sm font-medium capitalize">
                                {order.paymentMethod}
                              </span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-500 w-24">Fecha:</span>
                              <span className="text-sm font-medium">
                                {format(new Date(order.createdAt), 'PPPp', { locale: es })}
                              </span>
                            </div>
                            <div className="flex">
                              <span className="text-sm text-gray-500 w-24">Actualizado:</span>
                              <span className="text-sm font-medium">
                                {format(new Date(order.updatedAt), 'PPPp', { locale: es })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}