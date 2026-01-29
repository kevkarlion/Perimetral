import { IOrder } from "@/types/orderTypes";

const urlFrontend = process.env.BASE_URL

export function orderConfirmationEmail(order: IOrder) {
  return `
  <div style="font-family: Arial; max-width:600px;margin:auto">
    <h2>¡Gracias por tu compra!</h2>

    <p>Registramos tu pedido correctamente.</p>

    <p><strong>Orden:</strong> ${order.orderNumber}</p>
    <p><strong>Total:</strong> $${order.total.toLocaleString("es-AR")}</p>
    <p><strong>Estado:</strong> ${order.status}</p>

    <hr/>

    <h3>Productos</h3>
    <ul>
      ${order.items
        .map(
          (item) =>
            `<li>${item.name} x ${item.quantity} — $${(
              item.price * item.quantity
            ).toLocaleString("es-AR")}</li>`
        )
        .join("")}
    </ul>

    <p>
      Podés ver tu orden acá:<br/>
      <a href="${urlFrontend}/order/${order.accessToken}">
        Ver estado de mi pedido
      </a>
    </p>

    <p>Gracias por confiar en nosotros 💙</p>
  </div>
  `;
}




export function completedOrderEmail(order: Partial<IOrder>) {
  return `
  <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:10px;">
    <h2>¡Pago recibido!</h2>
    <p>Tu pago para la orden <strong>${order.orderNumber}</strong> fue confirmado correctamente.</p>

    <p><strong>Total abonado:</strong> $${order.total?.toLocaleString("es-AR")}</p>
    <p>Pronto comenzaremos con el procesamiento y envío de tu pedido.</p>

    <hr/>

    <h3>Estado de tu orden</h3>
    <p><strong>Orden:</strong> ${order.orderNumber}</p>
    <p><strong>Estado:</strong> Completada</p>

    ${order.items?.length
      ? `<h3>Productos</h3>
         <ul>
           ${order.items
             .map(
               (item) =>
                 `<li>${item.name} x ${item.quantity} — $${(
                   item.price * item.quantity
                 ).toLocaleString("es-AR")}</li>`
             )
             .join("")}
         </ul>`
      : ""
    }

    <p>
      Podés ver tu orden en cualquier momento:<br/>
      <a href="${process.env.BASE_URL}/order/${order.accessToken}">
        Ver estado de mi pedido
      </a>
    </p>

    <p>Gracias por confiar en nosotros 💙</p>
  </div>
  `;
}
