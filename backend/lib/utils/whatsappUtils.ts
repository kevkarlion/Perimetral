// backend/lib/utils/whatsappUtils.ts

/**
 * Función para generar enlaces de WhatsApp
 */
export const generateWhatsAppLink = (
  phone: string, 
  message: string
): string => {
  // Formatear número de teléfono
  const formatPhoneNumber = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, '');
    if (!cleaned.startsWith('54') && cleaned.length === 10) {
      cleaned = '54' + cleaned;
    }
    return cleaned;
  };

  const formattedPhone = formatPhoneNumber(phone);
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
};

/**
 * Función para crear mensajes de confirmación de orden
 */
export const createOrderConfirmationMessage = (
  orderNumber: string,
  customerName: string,
  total: number,
  paymentMethod: string,
  orderLink: string
): string => {
  if (paymentMethod === "efectivo") {
    return `¡Hola ${customerName}! 👋\n\n` +
      `Tu pedido *#${orderNumber}* ha sido registrado exitosamente. 🎉\n\n` +
      `*Total a pagar:* $${total.toFixed(2)}\n\n` +
      `Para completar tu compra:\n` +
      `• Contactanos al *2984252859*\n` +
      `• Horario: Lunes a Viernes de 8:00 a 18:00\n` +
      `• Menciona tu número de orden: ${orderNumber}\n` +
      `• Abona el monto total en efectivo\n\n` +
      `Puedes ver el estado de tu pedido aquí:\n${orderLink}\n\n` +
      `¡Gracias por tu compra! ❤️`;
  } else {
    return `¡Hola ${customerName}! 👋\n\n` +
      `Tu pedido *#${orderNumber}* ha sido registrado exitosamente. 🎉\n\n` +
      `*Total:* $${total.toFixed(2)}\n\n` +
      `Para completar tu pago, sigue el enlace de Mercado Pago que recibirás por email.\n\n` +
      `Puedes ver el estado de tu pedido aquí:\n${orderLink}\n\n` +
      `¡Gracias por tu compra! ❤️`;
  }
};

/**
 * Función para crear mensajes de notificación al vendedor
 */
export const createSellerNotificationMessage = (order: any): string => {
  const productsSummary = order.items.map((item: any, index: number) => 
    `${index + 1}. ${item.name} - ${item.quantity} x $${item.price}`
  ).join('\n');

  return `🛒 *NUEVA ORDEN RECIBIDA* 🛒\n\n` +
    `*Orden #:* ${order.orderNumber}\n` +
    `*Cliente:* ${order.customer.name}\n` +
    `*Email:* ${order.customer.email}\n` +
    `*Teléfono:* ${order.customer.phone || 'No proporcionado'}\n` +
    `*Método de pago:* ${order.paymentMethod}\n` +
    `*Total:* $${order.total.toFixed(2)}\n\n` +
    `*Productos:*\n${productsSummary}\n\n` +
    `*Dirección:* ${order.customer.address || 'No proporcionada'}`;
};