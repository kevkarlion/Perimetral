import Order from '@/lib/models/Order'
import { IOrder } from '@/lib/types/orderTypes'

export const getOrdersService = async (): Promise<IOrder[]> => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    return orders
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}