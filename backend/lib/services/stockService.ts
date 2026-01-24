// backend/lib/services/stockService.ts
import { IOrder } from "@/types/orderTypes";
import { variationService } from "@/backend/lib/services/variationService";
import { toObjectId } from "@/backend/lib/herlpers/objectId";


//entra por el webhook de orden creada
export class StockService {
  static async discountFromOrder(order: IOrder) {
    for (const item of order.items) {
      if (!item.variationId) {
        throw new Error("Todos los items deben tener variationId");
      }
      await variationService.decrementStock(
        toObjectId(item.variationId),
        item.quantity,
        {
          orderToken: order.accessToken,
          productId: toObjectId(item.productId),
        }
      );
    }
  }
}
