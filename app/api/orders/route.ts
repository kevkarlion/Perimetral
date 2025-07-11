import { NextResponse } from 'next/server'
import { getOrders } from '@/lib/controllers/orderController'

export async function GET() {
  try {
    const orders = await getOrders()
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener las órdenes' },
      { status: 500 }
    )
  }
}