// services/order.services.ts
import Order from "@/backend/lib/models/Order";
import { validateCart } from "@/backend/lib/services/validate.cart.services";
import { MercadoPagoService } from "./mercadoPago.services";
import { sendEmail } from "@/backend/lib/services/emailService"; // ✅ Usando tu función existente
import { updateStockViaApi } from "@/backend/lib/services/stockApiService";

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
        total: orderData.total,
      });

      // 2. Determinar estado inicial según método de pago
      const initialStatus =
        orderData.paymentMethod === "efectivo" ? "pending_payment" : "pending";

      // 3. Configurar detalles de pago específicos
      const paymentDetails: any = {
        status: "pending",
        method: orderData.paymentMethod,
      };

      // Para pagos en efectivo, agregar fecha de expiración
      if (orderData.paymentMethod === "efectivo") {
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
        paymentDetails,
      });

      console.log("order desde servicio", order);

      await order.save();

      // 5. Enviar email de confirmación al cliente Y al vendedor
      await Promise.all([
        this.sendOrderConfirmationEmail(order, orderData.paymentMethod),
        this.sendVendorNotificationEmail(order, orderData.paymentMethod)
      ]);

      // 6. Si el método es MercadoPago, crear preferencia
      if (orderData.paymentMethod === "mercadopago") {
        try {
          const preference = await MercadoPagoService.createPreference(order);

          // Manejo seguro de sandbox/producción
          const paymentUrl =
            (preference as any).sandbox_init_point || preference.init_point;

          if (!paymentUrl) {
            throw new Error("No se pudo generar URL de pago de MercadoPago");
          }

          // Actualizar la orden con los detalles de pago de MercadoPago
          order.paymentDetails = {
            ...order.paymentDetails,
            paymentUrl,
            merchantOrderId: preference.id,
            paymentStatus: "pending",
          };

          await order.save();

          return {
            ...order.toObject(),
            paymentUrl,
          };
        } catch (mpError: any) {
          // Manejo específico de errores de MercadoPago
          console.error("Error en MercadoPago:", mpError);
          order.status = "payment_failed";
          order.paymentDetails = {
            ...order.paymentDetails,
            error: mpError.message,
            paymentStatus: "failed",
          };
          await order.save();

          throw new Error(`Error al procesar pago: ${mpError.message}`);
        }
      }

      // 7. Para pagos en efectivo, retornar información para redirección
      if (orderData.paymentMethod === "efectivo") {
        return {
          ...order.toObject(),
          redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/pago-pendiente/efectivo?orderNumber=${order.orderNumber}&total=${order.total}&token=${order.accessToken}`,
        };
      }

      // 8. Para otros métodos de pago, retornar la orden normal
      return order;
    } catch (error: any) {
      console.error("Error general al crear orden:", error);
      throw new Error(`Error al crear la orden: ${error.message}`);
    }
  }

  // 🔹 NUEVA FUNCIÓN: Enviar email de notificación al vendedor
  static async sendVendorNotificationEmail(order: any, paymentMethod: string) {
    try {
      const vendorEmail = process.env.VENDOR_EMAIL || 'vendedor@tuempresa.com';
      
      if (!vendorEmail) {
        console.warn('Email del vendedor no configurado. Skipping vendor notification.');
        return;
      }

      const orderLink = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders`;
      const orderDetailLink = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders/${order._id}`;

      let paymentStatusInfo = "";
      let emailSubject = "";

      if (paymentMethod === "efectivo") {
        emailSubject = `📦 NUEVA ORDEN #${order.orderNumber} - PAGO PENDIENTE`;
        paymentStatusInfo = `
          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 16px 0; border-radius: 4px;">
            <h4 style="color: #d97706; margin-top: 0;">⚠️ PAGO PENDIENTE - EFECTIVO</h4>
            <p>El cliente debe contactarse para completar el pago.</p>
            <p><strong>Fecha límite para pagar:</strong> ${new Date(
              order.paymentDetails.expirationDate
            ).toLocaleDateString("es-AR")}</p>
          </div>
        `;
      } else {
        emailSubject = `📦 NUEVA ORDEN #${order.orderNumber} - PAGO ONLINE`;
        paymentStatusInfo = `
          <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; margin: 16px 0; border-radius: 4px;">
            <h4 style="color: #059669; margin-top: 0;">✅ PAGO ONLINE</h4>
            <p>El pago se procesará electrónicamente.</p>
          </div>
        `;
      }

      // Resumen de productos
      const productsSummary = order.items.map((item: any) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `).join('');

      await sendEmail({
        to: vendorEmail,
        subject: emailSubject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
            <h1 style="color: #4f46e5; text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 16px;">
              🎉 NUEVA ORDEN RECIBIDA
            </h1>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #1e293b; margin-top: 0;">Resumen de la Orden</h2>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                <div>
                  <h3 style="color: #374151; margin-bottom: 8px;">📋 Información de la Orden</h3>
                  <p><strong>N° Orden:</strong> ${order.orderNumber}</p>
                  <p><strong>Fecha:</strong> ${new Date(order.createdAt).toLocaleString('es-AR')}</p>
                  <p><strong>Método de pago:</strong> ${paymentMethod}</p>
                  <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
                </div>
                
                <div>
                  <h3 style="color: #374151; margin-bottom: 8px;">👤 Información del Cliente</h3>
                  <p><strong>Nombre:</strong> ${order.customer.name}</p>
                  <p><strong>Email:</strong> ${order.customer.email}</p>
                  <p><strong>Teléfono:</strong> ${order.customer.phone || 'No proporcionado'}</p>
                  ${order.customer.address ? `<p><strong>Dirección:</strong> ${order.customer.address}</p>` : ''}
                </div>
              </div>

              ${paymentStatusInfo}

              <h3 style="color: #374151; margin-bottom: 16px;">🛒 Productos</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background-color: #f1f5f9;">
                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #cbd5e1;">Producto</th>
                    <th style="padding: 12px; text-align: center; border-bottom: 2px solid #cbd5e1;">Cantidad</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1;">Precio Unit.</th>
                    <th style="padding: 12px; text-align: right; border-bottom: 2px solid #cbd5e1;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsSummary}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="3" style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #cbd5e1;">Total:</td>
                    <td style="padding: 12px; text-align: right; font-weight: bold; border-top: 2px solid #cbd5e1;">$${order.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            
          </div>
        `,
      });

      console.log(`✅ Email de notificación enviado al vendedor: ${vendorEmail}`);

    } catch (emailError) {
      console.error("Error al enviar email de notificación al vendedor:", emailError);
      // No lanzamos error para no interrumpir el flujo de compra
    }
  }

  static async sendOrderConfirmationEmail(order: any, paymentMethod: string) {
    try {
      const orderLink = `${process.env.NEXT_PUBLIC_BASE_URL}/order/${order.accessToken}`;

      let paymentInstructions = "";
      let emailSubject = "";

      if (paymentMethod === "efectivo") {
        emailSubject = `Confirmación de pedido #${order.orderNumber} - Pago pendiente`;
        paymentInstructions = `
          <h3 style="color: #d97706; margin-bottom: 16px;">¡Pedido registrado exitosamente!</h3>
          <p>Tu pedido <strong>#${
            order.orderNumber
          }</strong> ha sido registrado correctamente.</p>
          <p><strong>Total a pagar:</strong> $${order.total.toFixed(2)}</p>
          
          <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 16px 0; border-radius: 4px;">
            <h4 style="color: #d97706; margin-top: 0;">Para completar tu compra:</h4>
            <ul style="margin-bottom: 0;">
              <li>Contactanos para completar el pedido</strong></li>
              <li>Horario de atención: <strong>Lunes a Viernes de 8:00 a 18:00</strong></li>
              <li>Menciona tu número de orden: <strong>${
                order.orderNumber
              }</strong></li>
              <li>Abona el monto total en efectivo</li>
            </ul>
          </div>
          
          <p><strong>Fecha límite para pagar:</strong> ${new Date(
            order.paymentDetails.expirationDate
          ).toLocaleDateString("es-AR")}</p>
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
        `,
      });

      console.log(`✅ Email de confirmación enviado al cliente: ${order.customer.email}`);

    } catch (emailError) {
      console.error("Error al enviar email de confirmación:", emailError);
      // No lanzamos error para no interrumpir el flujo de compra
    }
  }

  // ... el resto de las funciones permanecen igual ...
  static async updateOrderStatus(
    identifier: string,
    status: string,
    additionalData: any = {},
    identifierType: "id" | "token" = "id"
  ) {
    try {
      let query = {};
      if (identifierType === "id") {
        query = { _id: identifier };
      } else {
        query = { accessToken: identifier };
      }
      
      const updateData: any = { 
        status,
        updatedAt: new Date()
      };
      
      // Agregar datos adicionales si existen
      if (additionalData.discount !== undefined) {
        updateData.discount = additionalData.discount;
      }
      
      if (additionalData.total !== undefined) {
        updateData.total = additionalData.total;
      }
      
      const order = await Order.findOneAndUpdate(
        query,
        updateData,
        { new: true }
      );
      
      if (!order) {
        throw new Error("Orden no encontrada");
      }
      
      return order;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }

  // ... (las demás funciones se mantienen igual) ...


  static async handleStockManagement(
    order: any,
    newStatus: string,
    previousStatus: string
  ) {
    try {
      // Si el pago se confirma (de pending_payment a processing/completed)
      if (
        (previousStatus === "pending_payment" ||
          previousStatus === "pending") &&
        (newStatus === "processing" || newStatus === "completed")
      ) {
        console.log(
          `Confirmando pago y actualizando stock para orden ${order._id}`
        );
        await this.adjustOrderStock(order.items, "decrement");
      }

      // Si la orden se cancela o rechaza después de haber confirmado stock
      else if (
        (previousStatus === "processing" || previousStatus === "completed") &&
        (newStatus === "cancelled" ||
          newStatus === "rejected" ||
          newStatus === "payment_failed")
      ) {
        console.log(
          `Cancelando orden y revertiendo stock para orden ${order._id}`
        );
        await this.adjustOrderStock(order.items, "increment");
      }

      // Si la orden estaba pendiente de pago y se cancela
      else if (
        previousStatus === "pending_payment" &&
        (newStatus === "cancelled" ||
          newStatus === "rejected" ||
          newStatus === "payment_failed")
      ) {
        console.log(`Cancelando orden pendiente de pago ${order._id}`);
        // No es necesario hacer nada con el stock porque nunca se decrementó
      }
    } catch (stockError) {
      console.error("Error en la gestión de stock:", stockError);
      // No lanzamos el error para no interrumpir el flujo principal
    }
  }

  static async adjustOrderStock(
    items: Array<{
      productId: string;
      variationId?: string;
      quantity: number;
    }>,
    operation: "increment" | "decrement"
  ) {
    const results = [];

    for (const item of items) {
      try {
        // Usar el servicio de API para actualizar el stock
        await updateStockViaApi({
          productId: item.productId,
          variationId: item.variationId,
          stock: item.quantity,
          action: operation === "decrement" ? "decrement" : "increment",
        });

        results.push({
          productId: item.productId,
          variationId: item.variationId,
          success: true,
          message: `Stock ${
            operation === "decrement" ? "decrementado" : "incrementado"
          } correctamente`,
        });

        console.log(
          `Stock ${
            operation === "decrement" ? "decrementado" : "incrementado"
          } para producto ${item.productId}`
        );
      } catch (error) {
        console.error(
          `Error ajustando stock para producto ${item.productId}:`,
          error
        );
        results.push({
          productId: item.productId,
          variationId: item.variationId,
          success: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }

    // Verificar si hubo errores críticos
    const failedUpdates = results.filter((r) => !r.success);
    if (failedUpdates.length > 0) {
      console.warn(
        `${failedUpdates.length} actualizaciones de stock fallaron:`,
        failedUpdates
      );
      // Podrías lanzar un error aquí o notificar al administrador
      throw new Error(
        `Fallaron ${failedUpdates.length} actualizaciones de stock`
      );
    }

    return results;
  }

  static async getOrderById(orderId: string) {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error("Orden no encontrada");
      }
      return order;
    } catch (error: any) {
      console.error("Error al obtener orden:", error);
      throw new Error(`Error al obtener la orden: ${error.message}`);
    }
  }

  static async getOrderByToken(token: string) {
    try {
      const order = await Order.findOne({ accessToken: token });
      if (!order) {
        throw new Error("Orden no encontrada");
      }
      return order;
    } catch (error: any) {
      console.error("Error al obtener orden por token:", error);
      throw new Error(`Error al obtener la orden: ${error.message}`);
    }
  }

  static async getOrdersByCustomer(email: string) {
    try {
      const orders = await Order.find({ "customer.email": email })
        .sort({ createdAt: -1 })
        .limit(20);
      return orders;
    } catch (error: any) {
      console.error("Error al obtener órdenes del cliente:", error);
      throw new Error(`Error al obtener las órdenes: ${error.message}`);
    }
  }

  static async updateOrderNotes(
    identifier: string,
    notes: string,
    identifierType: "id" | "token" = "id"
  ) {
    try {
      let query = {};
      if (identifierType === "id") {
        query = { _id: identifier };
      } else {
        query = { accessToken: identifier };
      }

      const order = await Order.findOneAndUpdate(
        query,
        { notes, updatedAt: new Date() },
        { new: true }
      );

      if (!order) {
        throw new Error("Orden no encontrada");
      }

      return order;
    } catch (error) {
      console.error("Error actualizando notas de la orden:", error);
      throw error;
    }
  }
}