// services/order.services.ts
import Order from '@/backend/lib/models/Order';
import { validateCart } from '@/backend/lib/services/validate.cart.services';
import { MercadoPagoService } from './mercadoPago.services';
import { sendEmail } from '@/backend/lib/services/emailService';

export class OrderService {
  static async createValidatedOrder(orderData: {
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
    try {
      // 1. Validar el carrito
      const validated = await validateCart({
        items: orderData.items,
        total: orderData.total
      });

      // 2. Determinar estado inicial según método de pago
      const initialStatus = orderData.paymentMethod === 'efectivo' ? 'pending_payment' : 'pending';
      
      // 3. Configurar detalles de pago específicos
      const paymentDetails: any = {
        status: 'pending',
        method: orderData.paymentMethod
      };

      // Para pagos en efectivo, agregar fecha de expiración
      if (orderData.paymentMethod === 'efectivo') {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7); // 7 días para pagar
        paymentDetails.expirationDate = expirationDate;
      }

      
      // 4. Crear la orden en DB
      const order = new Order({
        customer: orderData.customer,
        items: validated.items,
        total: validated.total,
        status: initialStatus,
        paymentMethod: orderData.paymentMethod,
        paymentDetails
      });

      console.log('order desde servicio', order)

      await order.save();

      // 5. Enviar email de confirmación inmediatamente para todos los métodos
      await this.sendOrderConfirmationEmail(order, orderData.paymentMethod);

      // 6. Si el método es MercadoPago, crear preferencia
      if (orderData.paymentMethod === 'mercadopago') {
        try {
          const preference = await MercadoPagoService.createPreference(order);
          
          // Manejo seguro de sandbox/producción
          const paymentUrl = (preference as any).sandbox_init_point || preference.init_point;
          
          if (!paymentUrl) {
            throw new Error('No se pudo generar URL de pago de MercadoPago');
          }

          // Actualizar la orden con los detalles de pago de MercadoPago
          order.paymentDetails = {
            ...order.paymentDetails,
            paymentUrl,
            merchantOrderId: preference.id,
            paymentStatus: 'pending'
          };

          await order.save();

          return {
            ...order.toObject(),
            paymentUrl
          };
        } catch (mpError: any) {
          // Manejo específico de errores de MercadoPago
          console.error('Error en MercadoPago:', mpError);
          order.status = 'payment_failed';
          order.paymentDetails = {
            ...order.paymentDetails,
            error: mpError.message,
            paymentStatus: 'failed'
          };
          await order.save();
          
          throw new Error(`Error al procesar pago: ${mpError.message}`);
        }
      }

      // 7. Para pagos en efectivo, retornar información para redirección
      if (orderData.paymentMethod === 'efectivo') {
        return {
          ...order.toObject(),
          redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/pago-pendiente/efectivo?orderNumber=${order.orderNumber}&total=${order.total}&token=${order.accessToken}`
        };
      }

      // 8. Para otros métodos de pago, retornar la orden normal
      return order;
      
    } catch (error: any) {
      console.error('Error general al crear orden:', error);
      throw new Error(`Error al crear la orden: ${error.message}`);
    }
  }

  static async sendOrderConfirmationEmail(order: any, paymentMethod: string) {
    try {
      const orderLink = `${process.env.NEXT_PUBLIC_BASE_URL}/order/${order.accessToken}`;
      
      let paymentInstructions = '';
      let emailSubject = '';
      
      if (paymentMethod === 'efectivo') {
        emailSubject = `Confirmación de pedido #${order.orderNumber} - Pago pendiente`;
        paymentInstructions = `
          <h3 style="color: #d97706; margin-bottom: 16px;">¡Pedido registrado exitosamente!</h3>
          <p>Tu pedido <strong>#${order.orderNumber}</strong> ha sido registrado correctamente.</p>
          <p><strong>Total a pagar:</strong> $${order.total.toFixed(2)}</p>
          
          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 16px 0; border-radius: 4px;">
            <h4 style="color: #d97706; margin-top: 0;">Para completar tu compra:</h4>
            <ul style="margin-bottom: 0;">
              <li>Acercate a nuestro local: <strong>[Tu dirección completa]</strong></li>
              <li>Horario de atención: <strong>Lunes a Viernes de 8:00 a 18:00</strong></li>
              <li>Menciona tu número de orden: <strong>${order.orderNumber}</strong></li>
              <li>Abona el monto total en efectivo</li>
            </ul>
          </div>
          
          <p><strong>Fecha límite para pagar:</strong> ${new Date(order.paymentDetails.expirationDate).toLocaleDateString('es-AR')}</p>
          <p>Tu pedido se preparará y estará listo para retirar una vez confirmado el pago.</p>
        `;
      } else {
        emailSubject = `Confirmación de tu orden #${order.orderNumber}`;
        paymentInstructions = `
          <p>Puedes completar tu pago a través de Mercado Pago.</p>
        `;
      }
      
      await sendEmail({
        to: order.customer.email,
        subject: emailSubject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5; text-align: center;">¡Gracias por tu compra!</h1>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              ${paymentInstructions}
            </div>
            
            <p>Puedes ver el estado de tu pedido en el siguiente enlace:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${orderLink}" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Ver mi orden
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280;">
              O copia y pega esta URL en tu navegador:<br>
              <span style="word-break: break-all; color: #374151;">${orderLink}</span>
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 14px; color: #6b7280;">
                Si tienes alguna pregunta, no dudes en contactarnos.<br>
                Teléfono: [Tu teléfono] | Email: [Tu email]
              </p>
            </div>
          </div>
        `
      });
    } catch (emailError) {
      console.error('Error al enviar email de confirmación:', emailError);
      // No lanzamos error para no interrumpir el flujo de compra
    }
  }

  static async updateOrderStatus(orderId: string, status: string, paymentDetails: any = {}) {
    try {
      const validStatuses = ['pending', 'pending_payment', 'processing', 'completed', 'payment_failed', 'cancelled', 'rejected'];
      
      if (!validStatuses.includes(status)) {
        throw new Error(`Estado '${status}' no válido`);
      }

      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          status,
          'paymentDetails.status': paymentDetails.status || status,
          'paymentDetails.updated': new Date(),
          ...paymentDetails,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!order) {
        throw new Error('Orden no encontrada');
      }

      return order;
    } catch (error: any) {
      console.error('Error al actualizar orden:', error);
      throw new Error(`Error al actualizar estado de la orden: ${error.message}`);
    }
  }

  static async getOrderById(orderId: string) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error('Orden no encontrada');
      }
      return order;
    } catch (error: any) {
      console.error('Error al obtener orden:', error);
      throw new Error(`Error al obtener la orden: ${error.message}`);
    }
  }

  static async getOrderByToken(token: string) {
    try {
      const order = await Order.findOne({ accessToken: token });
      if (!order) {
        throw new Error('Orden no encontrada');
      }
      return order;
    } catch (error: any) {
      console.error('Error al obtener orden por token:', error);
      throw new Error(`Error al obtener la orden: ${error.message}`);
    }
  }

  static async getOrdersByCustomer(email: string) {
    try {
      const orders = await Order.find({ 'customer.email': email })
        .sort({ createdAt: -1 })
        .limit(20);
      return orders;
    } catch (error: any) {
      console.error('Error al obtener órdenes del cliente:', error);
      throw new Error(`Error al obtener las órdenes: ${error.message}`);
    }
  }
}