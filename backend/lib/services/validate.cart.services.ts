// lib/validateCart.ts
import { dbConnect } from '@/backend/lib/dbConnect/dbConnect';
import { Types } from 'mongoose';
import { IProduct, IVariation } from '@/types/productTypes';
import Product from '@/backend/lib/models/Product';

interface CartItem {
  productId: string;
  variationId?: string;
  name?: string;
  price: number; // Precio unitario SIN IVA
  quantity: number;
  image?: string;
}

interface CartData {
  items: CartItem[];
  total: number; // Total CON IVA incluido
  subtotal?: number; // Opcional: subtotal SIN IVA
  iva?: number; // Opcional: monto de IVA
}

const IVA_PERCENTAGE = 21; // 21% de IVA

export async function validateCart(cartData: CartData) {
  try {
    await dbConnect();

    // 1. Validar estructura básica
    if (!cartData?.items || !Array.isArray(cartData.items)) {
      throw new Error('Estructura de carrito inválida');
    }

    if (cartData.items.length === 0) {
      throw new Error('El carrito está vacío');
    }

    // 2. Validar formatos de IDs
    const productIds = cartData.items.map(item => item.productId);
    const invalidIds = productIds.filter(id => !Types.ObjectId.isValid(id));
    
    if (invalidIds.length > 0) {
      throw new Error(`IDs de producto inválidos: ${invalidIds.join(', ')}`);
    }

    // 3. Obtener productos de la DB
    const dbProducts = await Product.find({ 
      _id: { $in: productIds.map(id => new Types.ObjectId(id)) }
    });

    // 4. Validar cada item y calcular subtotal (SIN IVA)
    let calculatedSubtotal = 0; // Solo subtotal SIN IVA
    const validatedItems = await Promise.all(
      cartData.items.map(async (item) => {
        const dbProduct = dbProducts.find(p => 
          p._id.toString() === item.productId
        );

        if (!dbProduct) {
          throw new Error(`Producto no encontrado: ${item.productId}`);
        }

        if (!dbProduct.activo) {
          throw new Error(`Producto no disponible: ${dbProduct.nombre}`);
        }

        // Manejo de variaciones (tu código existente)
        let selectedVariation: IVariation | undefined;
        let isVariationValid = true;

        if (item.variationId) {
          if (!dbProduct.tieneVariaciones) {
            console.warn(`Producto ${dbProduct.nombre} no tiene variaciones pero se especificó variationId. Ignorando...`);
            isVariationValid = false;
          } else {
            selectedVariation = dbProduct.variaciones.find((v:any) => 
              v._id?.toString() === item.variationId || 
              v.codigo === item.variationId
            );
            
            if (!selectedVariation) {
              throw new Error(`Variación no encontrada: ${item.variationId}`);
            }
            
            if (selectedVariation.activo === false) {
              throw new Error(`Variación no disponible: ${selectedVariation.descripcion}`);
            }
          }
        } else if (dbProduct.tieneVariaciones) {
          throw new Error(`El producto requiere selección de variación`);
        }

        // Obtener precio base (SIN IVA)
        const basePrice = selectedVariation && isVariationValid
          ? selectedVariation.precio
          : dbProduct.precio || 0;

        // Validar stock (tu código existente)
        const availableStock = selectedVariation && isVariationValid 
          ? selectedVariation.stock 
          : dbProduct.stock || 0;
        
        if (availableStock < item.quantity) {
          const productName = selectedVariation 
            ? `${dbProduct.nombre} - ${selectedVariation.descripcion || selectedVariation.codigo}`
            : dbProduct.nombre;
            
          throw new Error(`Stock insuficiente para ${productName}. Disponible: ${availableStock}`);
        }

        // Validar precio (comparando precios SIN IVA)
        if (Math.abs(basePrice - item.price) > 0.01) {
          throw new Error(`Precio actualizado. Nuevo precio: ${basePrice.toFixed(2)} (sin IVA)`);
        }

        // Calcular solo el subtotal (SIN IVA)
        const itemSubtotal = basePrice * item.quantity;
        calculatedSubtotal += itemSubtotal;

        return {
          ...item,
          name: selectedVariation && isVariationValid
            ? `${dbProduct.nombre} - ${selectedVariation.descripcion || selectedVariation.codigo}`
            : dbProduct.nombre,
          price: basePrice, // Precio SIN IVA
          priceWithVat: basePrice * (1 + IVA_PERCENTAGE / 100), // Precio CON IVA (para referencia)
          image: selectedVariation?.imagenes?.[0] || dbProduct.imagenesGenerales?.[0] || item.image || null,
          sku: selectedVariation?.codigo || dbProduct.codigoPrincipal,
          stock: availableStock,
          variationId: isVariationValid ? item.variationId : undefined,
          vatPercentage: IVA_PERCENTAGE
        };
      })
    );

    // 5. Calcular el total esperado CON IVA basado en los precios validados
    const expectedTotalWithVat = calculatedSubtotal * (1 + IVA_PERCENTAGE / 100);
    const calculatedVat = calculatedSubtotal * (IVA_PERCENTAGE / 100);

    // 6. Validar que el total recibido sea razonable (con tolerancia)
    const tolerance = 0.01; // 1% de tolerancia para diferencias por decimales
    
    // Calcular el rango aceptable
    const minAcceptableTotal = expectedTotalWithVat * (1 - tolerance);
    const maxAcceptableTotal = expectedTotalWithVat * (1 + tolerance);

    if (cartData.total < minAcceptableTotal || cartData.total > maxAcceptableTotal) {
      throw new Error(
        `El total del carrito no coincide con los precios validados. 
        Subtotal calculado (sin IVA): $${calculatedSubtotal.toFixed(2)} | 
        IVA (${IVA_PERCENTAGE}%): $${calculatedVat.toFixed(2)} | 
        Total esperado (con IVA): $${expectedTotalWithVat.toFixed(2)} | 
        Total recibido: $${cartData.total.toFixed(2)}`
      );
    }

    // 7. Retornar los datos validados, pero PRESERVAR el total original del frontend
    return {
      items: validatedItems,
      subtotal: parseFloat(calculatedSubtotal.toFixed(2)),
      vat: parseFloat(calculatedVat.toFixed(2)),
      total: parseFloat(cartData.total.toFixed(2)), // ← ¡IMPORTANTE! Usar el total del frontend
      validatedAt: new Date(),
      vatPercentage: IVA_PERCENTAGE,
      // Información adicional para debugging
      validation: {
        calculatedTotal: parseFloat(expectedTotalWithVat.toFixed(2)),
        receivedTotal: parseFloat(cartData.total.toFixed(2)),
        difference: parseFloat(Math.abs(expectedTotalWithVat - cartData.total).toFixed(2)),
        withinTolerance: Math.abs(expectedTotalWithVat - cartData.total) <= (expectedTotalWithVat * tolerance)
      }
    };

  } catch (error) {
    console.error('[validateCart] Error:', error);
    throw error;
  }
}