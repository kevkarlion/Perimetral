// pages/api/cart/validate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/lib/dbConnect/dbConnect';
import Product from '@/lib/models/Product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    await dbConnect();
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Formato de items inválido' });
    }

    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({ error: 'Item con formato inválido' });
      }

      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Producto ${item.productId} no encontrado` });
      }

      let price;
      if (item.variationId) {
        const variation = product.variaciones.find((v: any) => v._id.toString() === item.variationId);
        if (!variation) {
          return res.status(404).json({ error: `Variación ${item.variationId} no encontrada` });
        }
        price = variation.precio;
      } else {
        if (product.tieneVariaciones) {
          return res.status(400).json({ error: 'Este producto requiere selección de variación' });
        }
        price = product.precio || 0;
      }

      calculatedTotal += price * item.quantity;
      validatedItems.push({
        productId: item.productId,
        variationId: item.variationId,
        quantity: item.quantity,
        price
      });
    }

    const iva = calculatedTotal * 0.21;
    calculatedTotal += iva;

    return res.status(200).json({
      valid: true,
      calculatedTotal,
      items: validatedItems
    });

  } catch (error) {
    console.error('Error validando carrito:', error);
    return res.status(500).json({ error: 'Error interno validando carrito' });
  }
}