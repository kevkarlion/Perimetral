// backend/lib/helpers/totalsHelpers.ts
export const IVA_PERCENTAGE = 21;

export interface CartItem {
  price: number;
  quantity: number;
}

/**
 * Calcula totales de carrito y aplica descuento si corresponde.
 * @param items Array de items del carrito
 * @param discountPercentage Porcentaje de descuento a aplicar (0-100)
 */
export function calculateTotals(
  items: CartItem[],
  discountPercentage: number = 0,
  previousTotalBeforeDiscount?: number // para evitar re-aplicar descuento
) {
  // Subtotal sin descuento
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const iva = subtotal * (IVA_PERCENTAGE / 100);
  const totalSinDescuento = subtotal + iva;

  let total = totalSinDescuento;
  let totalBeforeDiscount: number | undefined = undefined;

  if (discountPercentage > 0) {
    if (previousTotalBeforeDiscount) {
      // Ya había descuento aplicado, no aplicar otro
      throw new Error("El descuento ya fue aplicado previamente. No se puede aplicar otro.");
    }

    totalBeforeDiscount = totalSinDescuento;
    const discountAmount = Math.round((totalSinDescuento * discountPercentage) / 100);
    total = totalSinDescuento - discountAmount;
  }

  return { subtotal, iva, total, totalBeforeDiscount };
}
