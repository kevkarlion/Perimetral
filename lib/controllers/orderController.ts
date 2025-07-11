import { getOrdersService } from '@/lib/services/orderService'
import { IOrder } from '@/lib/types/orderTypes'

export const getOrders = async (): Promise<IOrder[]> => {
  return await getOrdersService()
}