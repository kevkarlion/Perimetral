// backend/lib/helpers/totalsHelpers.ts
const IVA_PERCENTAGE = 21;

interface CartItem {
  price: number;
  quantity: number;
}

export function calculateTotals(items: CartItem[]) {
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const iva = subtotal * (IVA_PERCENTAGE / 100);
  const total = subtotal + iva;
  return { subtotal, iva, total };
}
