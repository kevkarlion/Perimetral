import { IVariation } from "@/types/ProductFormData";
import { CartItem } from "@/types/cartTypes";

export const variationToCartItem = (variation: IVariation): CartItem => {
  if (!variation._id || !variation.productId) {
    throw new Error("La variación debe tener _id y productId");
  }

  return {
    id: variation._id,          // único para la variación
    productId: variation.productId,
    variationId: variation._id, // opcional, útil si quieres diferenciar variaciones
    name: variation.nombre,
    price: variation.precio,
    quantity: 1,
    image: variation.imagenes?.[0],
    medida: variation.medida,
  };
};
