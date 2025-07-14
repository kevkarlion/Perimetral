// /lib/validateCart.ts
import Product from '@/lib/models/Product';
import { dbConnect } from '@/lib/dbConnect/dbConnect';

export async function validateCart(cartData: {
  items: Array<{
    productId: string;
    variationId?: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}) {
  await dbConnect();

  // 1. Validar estructura básica
  if (!cartData?.items || !Array.isArray(cartData.items)) {
    throw new Error('Estructura de carrito inválida');
  }

  // 2. Obtener productos de la DB
  const productIds = cartData.items.map(item => item.productId);
  const dbProducts = await Product.find({ 
    _id: { $in: productIds },
    isActive: true 
  });

  // 3. Validar cada item
  let validatedTotal = 0;
  const validatedItems = await Promise.all(
    cartData.items.map(async (item) => {
      const dbProduct = dbProducts.find(
        p => p._id.toString() === item.productId
      );

      if (!dbProduct) {
        throw new Error(`Producto no encontrado: ${item.productId}`);
      }

      // Validar stock
      if (dbProduct.stock < item.quantity) {
        throw new Error(
          `Stock insuficiente para ${dbProduct.name}. Disponible: ${dbProduct.stock}`
        );
      }

      // Validar precio (usar el de DB)
      if (dbProduct.price !== item.price) {
        throw new Error(
          `Precio actualizado para ${dbProduct.name}. Nuevo precio: ${dbProduct.price}`
        );
      }

      validatedTotal += dbProduct.price * item.quantity;

      return {
        ...item,
        name: dbProduct.name,
        price: dbProduct.price, // Forzar precio de DB
        image: dbProduct.images[0] || null
      };
    })
  );

  // 4. Validar total
  if (Math.abs(validatedTotal - cartData.total) > 0.01) {
    throw new Error(`El total calculado no coincide. Total correcto: ${validatedTotal}`);
  }

  return {
    items: validatedItems,
    total: validatedTotal,
    validatedAt: new Date()
  };
}