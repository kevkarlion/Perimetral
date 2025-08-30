"use client";

import { IStockMovement } from "@/types/stockTypes";
import { Types } from "mongoose";

interface PopulatedProduct {
  _id: Types.ObjectId;
  nombre: string;
  codigoPrincipal: string;
}

function isPopulatedProduct(obj: any): obj is PopulatedProduct {
  return (
    obj &&
    typeof obj === "object" &&
    "nombre" in obj &&
    "codigoPrincipal" in obj
  );
}

export default function StockMovementsTable({
  movements,
}: {
  movements: IStockMovement[];
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="w-full overflow-x-auto">
      {/* Tabla visible en md+ */}
      <table className="hidden md:table w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID Producto</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Código</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Cantidad</th>
            <th className="border p-2">Stock Ant.</th>
            <th className="border p-2">Stock Nuevo</th>
            <th className="border p-2">Razón</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => {
            const product = isPopulatedProduct(m.productId)
              ? m.productId
              : null;
            return (
              <tr key={m._id.toString()} className="hover:bg-gray-50">
                <td className="border p-2 font-mono text-xs text-gray-600">
                  {product
                    ? product._id.toString()
                    : m.productId?.toString() || "N/A"}
                </td>
                <td className="border p-2 whitespace-nowrap">
                  {formatDate(m.createdAt.toString())}
                </td>
                <td className="border p-2">
                  {product ? product.nombre : "N/A"}
                </td>
                <td className="border p-2 font-mono text-xs">
                  {product ? product.codigoPrincipal : "N/A"}
                </td>
                <td className="border p-2">
                  <span
                    className={`
                    px-2 py-1 rounded text-xs font-medium
                    ${m.type === "in" && "bg-green-100 text-green-800"}
                    ${m.type === "out" && "bg-red-100 text-red-800"}
                    ${m.type === "adjustment" && "bg-blue-100 text-blue-800"}
                    ${m.type === "transfer" && "bg-purple-100 text-purple-800"}
                  `}
                  >
                    {m.type === "in" && "Ingreso"}
                    {m.type === "out" && "Salida"}
                    {m.type === "adjustment" && "Ajuste"}
                    {m.type === "transfer" && "Transferencia"}
                  </span>
                </td>
                <td
                  className={`border p-2 font-medium ${
                    m.type === "in"
                      ? "text-green-600"
                      : m.type === "out"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {m.type === "in" ? "+" : ""}
                  {m.type === "out" ? "-" : ""}
                  {m.quantity}
                </td>
                <td className="border p-2">{m.previousStock}</td>
                <td className="border p-2 font-medium">{m.newStock}</td>
                <td className="border p-2">{m.reason}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Vista tipo card en mobile */}
      <div className="md:hidden space-y-4">
        {movements.map((m) => {
          const product = isPopulatedProduct(m.productId) ? m.productId : null;
          return (
            <div
              key={m._id.toString()}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <p className="text-xs font-mono text-gray-500 mb-2">
                <span className="font-semibold">ID:</span>{" "}
                {product
                  ? product._id.toString()
                  : m.productId?.toString() || "N/A"}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>
                  <span className="font-semibold">Fecha:</span>{" "}
                  {formatDate(m.createdAt.toString())}
                </p>
                <p>
                  <span className="font-semibold">Nombre:</span>{" "}
                  {product ? product.nombre : "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Código:</span>{" "}
                  {product ? product.codigoPrincipal : "N/A"}
                </p>
                <p>
                  <span className="font-semibold">Tipo:</span> {m.type}
                </p>
                <p
                  className={`font-semibold ${
                    m.type === "in"
                      ? "text-green-600"
                      : m.type === "out"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  <span className="font-semibold">Cantidad:</span>
                  {m.type === "in" ? `+${m.quantity}` : ""}
                  {m.type === "out" ? `-${m.quantity}` : ""}
                  {m.type === "adjustment" || m.type === "transfer"
                    ? `${m.quantity}`
                    : ""}
                </p>
                <p>
                  <span className="font-semibold">Stock Ant.:</span>{" "}
                  {m.previousStock}
                </p>
                <p>
                  <span className="font-semibold">Stock Nuevo:</span>{" "}
                  {m.newStock}
                </p>
                <p className="col-span-2">
                  <span className="font-semibold">Razón:</span> {m.reason}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
