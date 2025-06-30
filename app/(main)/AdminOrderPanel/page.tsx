'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Search, Filter, MoreVertical, Printer, Download, Eye, CheckCircle, XCircle, Clock, Truck, X } from 'lucide-react'

interface Order {
  id: string
  customer: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  payment: 'mercado_pago' | 'cash'
  items: {
    name: string
    quantity: number
    price: number
  }[]
}

export default function AdminOrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: 'ORD-1001',
        customer: 'María González',
        date: '2023-05-15',
        status: 'processing',
        total: 12500,
        payment: 'mercado_pago',
        items: [
          { name: 'Remera Oversize Negra', quantity: 2, price: 4500 },
          { name: 'Jeans Slim Fit', quantity: 1, price: 3500 }
        ]
      },
      {
        id: 'ORD-1002',
        customer: 'Carlos Pérez',
        date: '2023-05-14',
        status: 'pending',
        total: 7800,
        payment: 'cash',
        items: [
          { name: 'Camisa Lino Azul', quantity: 1, price: 7800 }
        ]
      },
      {
        id: 'ORD-1003',
        customer: 'Ana Rodríguez',
        date: '2023-05-13',
        status: 'shipped',
        total: 15300,
        payment: 'mercado_pago',
        items: [
          { name: 'Sweater Lana Merino', quantity: 1, price: 8900 },
          { name: 'Bufanda Algodón', quantity: 2, price: 3200 }
        ]
      },
      {
        id: 'ORD-1004',
        customer: 'Juan López',
        date: '2023-05-12',
        status: 'delivered',
        total: 6200,
        payment: 'cash',
        items: [
          { name: 'Gorra Trucker', quantity: 1, price: 3500 },
          { name: 'Medias Pack x3', quantity: 1, price: 2700 }
        ]
      }
    ]
    setOrders(mockOrders)
  }, [])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium'
    switch(status) {
      case 'pending':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}><Clock className="inline mr-1 h-3 w-3" /> Pendiente</span>
      case 'processing':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}><CheckCircle className="inline mr-1 h-3 w-3" /> Procesando</span>
      case 'shipped':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}><Truck className="inline mr-1 h-3 w-3" /> Enviado</span>
      case 'delivered':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircle className="inline mr-1 h-3 w-3" /> Entregado</span>
      case 'cancelled':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}><XCircle className="inline mr-1 h-3 w-3" /> Cancelado</span>
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Desconocido</span>
    }
  }

  const getPaymentIcon = (payment: string) => {
    switch(payment) {
      case 'mercado_pago':
        return (
          <div className="flex items-center">
            <Image 
              src="/payment-methods/mercado-pago.svg" 
              alt="Mercado Pago" 
              width={20} 
              height={20}
              className="mr-1"
            />
            <span>Mercado Pago</span>
          </div>
        )
      case 'cash':
        return (
          <div className="flex items-center">
            <Image 
              src="/payment-methods/efectivo.png" 
              alt="Efectivo" 
              width={20} 
              height={20}
              className="mr-1"
            />
            <span>Efectivo</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Gestión de Pedidos</h1>
      
      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative col-span-1 md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar por ID o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="processing">Procesando</option>
              <option value="shipped">Enviados</option>
              <option value="delivered">Entregados</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Total pedidos</h3>
          <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Pendientes</h3>
          <p className="text-2xl font-semibold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Procesando</h3>
          <p className="text-2xl font-semibold text-blue-600">{orders.filter(o => o.status === 'processing').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Enviados</h3>
          <p className="text-2xl font-semibold text-purple-600">{orders.filter(o => o.status === 'shipped').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500">Entregados</h3>
          <p className="text-2xl font-semibold text-green-600">{orders.filter(o => o.status === 'delivered').length}</p>
        </div>
      </div>

      {/* Tabla de pedidos */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pago</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total.toLocaleString('es-AR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getPaymentIcon(order.payment)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalle del pedido (modal) */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-bold text-gray-900">Detalle del pedido {selectedOrder.id}</h2>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Productos</h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${item.price.toLocaleString('es-AR')}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">${(item.price * item.quantity).toLocaleString('es-AR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Estado</h4>
                      <div className="flex items-center">
                        {getStatusBadge(selectedOrder.status)}
                        <div className="ml-auto">
                          <select 
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={selectedOrder.status}
                            onChange={(e) => setSelectedOrder({
                              ...selectedOrder,
                              status: e.target.value as any
                            })}
                          >
                            <option value="pending">Pendiente</option>
                            <option value="processing">Procesando</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregado</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Cliente</h4>
                      <p className="text-sm text-gray-900">{selectedOrder.customer}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Fecha</h4>
                      <p className="text-sm text-gray-900">{new Date(selectedOrder.date).toLocaleDateString()}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Método de pago</h4>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.payment === 'mercado_pago' ? (
                          <div className="flex items-center">
                            <Image 
                              src="/payment-methods/mercado-pago.svg" 
                              alt="Mercado Pago" 
                              width={20} 
                              height={20}
                              className="mr-1"
                            />
                            <span>Mercado Pago</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Image 
                              src="/payment-methods/efectivo.png" 
                              alt="Efectivo" 
                              width={20} 
                              height={20}
                              className="mr-1"
                            />
                            <span>Efectivo</span>
                          </div>
                        )}
                      </p>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Subtotal</span>
                        <span className="text-sm font-medium text-gray-900">${selectedOrder.total.toLocaleString('es-AR')}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Envío</span>
                        <span className="text-sm font-medium text-gray-900">$0</span>
                      </div>
                      <div className="flex justify-between font-medium text-lg mt-2 pt-2 border-t border-gray-200">
                        <span>Total</span>
                        <span>${selectedOrder.total.toLocaleString('es-AR')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Printer className="h-5 w-5 mr-2" />
                  Imprimir
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Exportar
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}