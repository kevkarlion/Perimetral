// lib/controllers/orderController.ts
import { OrderService } from '@/backend/lib/services/order.services';
import Order from '@/backend/lib/models/Order';
import { StockService } from '@/backend/lib/services/stockService';
import Product  from '@/backend/lib/models/Product';

export async function getOrders() {
  return await Order.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
}

export async function updateOrderByTokenController(
  token: string,
  status: string,
  additionalData: any = {}
) {
  const updatedOrder = await OrderService.updateOrderStatus(
    token,
    status,
    additionalData,
    "token"
  );

  // Si el estado es "completed", actualizar el stock
  if (status === "completed") {
    try {
      await updateStockForOrder(updatedOrder);
    } catch (error) {
      console.error("Error al actualizar stock:", error);
      // No lanzamos el error para no interrumpir la actualización de la orden
      // pero podrías manejarlo de otra forma según tus necesidades
    }
  }

  return updatedOrder;
}


async function updateStockForOrder(order: any) {
  if (!order || !order.items || order.items.length === 0) {
    return;
  }

  for (const item of order.items) {
    try {
      // Verificar si el producto tiene variación (medida)
      if (item.medida) {
        // Buscar la variación correspondiente
        const product = await Product.findById(item.productId);
        if (product && product.variaciones) {
          const variation = product.variaciones.find(
            (v: any) => v.medida === item.medida
          );
          
          if (variation) {
            await StockService.updateStock({
              productId: item.productId,
              variationId: variation._id,
              stock: item.quantity,
              action: "decrement" // Restar del stock
            });
          }
        }
      } else {
        // Producto sin variaciones
        await StockService.updateStock({
          productId: item.productId,
          stock: item.quantity,
          action: "decrement" // Restar del stock
        });
      }
    } catch (error) {
      console.error(`Error al actualizar stock para producto ${item.productId}:`, error);
    }
  }
}




export async function createOrder(orderData: {
  items: Array<{
    productId: string;
    variationId?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    medida?: string;
  }>;
  total: number;
  customer: {
    name: string;
    email: string;
    address?: string;
    phone?: string;
  };
  paymentMethod: string;
}) {


  return await OrderService.createValidatedOrder(orderData);
}



export async function updateOrderNotesController(
  token: string,
  notes: string
) {
  if (!notes) {
    throw new Error("Debes enviar una nota válida.");
  }

  const updatedOrder = await OrderService.updateOrderNotes(token, notes, "token");

  if (!updatedOrder) {
    throw new Error("Orden no encontrada");
  }

  return updatedOrder;
}