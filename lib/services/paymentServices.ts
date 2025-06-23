export class PaymentService {
  static async createMercadoPagoPreference(orderData: any) {
    try {
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: orderData.items.map((item: any) => ({
            title: item.nombre, // Usa el campo correcto de tu producto
            unit_price: item.precio,
            quantity: item.quantity,
          })),
          external_reference: orderData._id, // ID de tu orden
        }),
      });

      if (!response.ok) {
        throw new Error(`Error de MercadoPago: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al crear preferencia de pago:', error);
      throw error;
    }
  }
}