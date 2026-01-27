import { IOrder } from "@/types/orderTypes";

const urlFrontend = process.env.NEXT_PUBLIC_URL_FRONTEND

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
