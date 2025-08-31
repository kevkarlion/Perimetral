"use client";

import { IStockMovement } from "@/types/stockTypes";
import { Types } from "mongoose";

interface PopulatedProduct {
  _id: Types.ObjectId;
  nombre: string;
  codigoPrincipal: string;
}

interface Variation {
  _id: Types.ObjectId;
  codigo: string;
  medida: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  atributos: any;
  imagenes: any[];
  activo: boolean;
}

interface ExtendedStockMovement extends IStockMovement {
  product?: PopulatedProduct;
  variation?: Variation;
  createdByUser?: any;
}

function isPopulatedProduct(obj: any): obj is PopulatedProduct {
  return (
    obj &&
    typeof obj === "object" &&
    "nombre" in obj &&
    "codigoPrincipal" in obj
  );
}

function isVariation(obj: any): obj is Variation {
  return (
    obj &&
    typeof obj === "object" &&
    "codigo" in obj &&
    "medida" in obj &&
    "precio" in obj
  );
}

export default function StockMovementsTable({
  movements,
}: {
  movements: ExtendedStockMovement[];
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full overflow-x-auto">
      {/* Tabla visible en lg+ */}
      <table className="hidden lg:table w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Producto</th>
            <th className="border p-2">Variación</th>
            <th className="border p-2">Medida</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Tipo Mov.</th>
            <th className="border p-2">Cantidad</th>
            <th className="border p-2">Stock Ant.</th>
            <th className="border p-2">Stock Nuevo</th>
            <th className="border p-2">Razón</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => {
            const product = m.product;
            const variation = m.variation;
            
            return (
              <tr key={m._id.toString()} className="hover:bg-gray-50">
                {/* Fecha */}
                <td className="border p-2 whitespace-nowrap text-xs">
                  {formatDate(m.createdAt.toString())}
                </td>
                
                {/* Producto */}
                <td className="border p-2">
                  {product ? (
                    <div>
                      <div className="font-semibold">{product.nombre}</div>
                      <div className="text-xs text-gray-500 font-mono">
                        {product.codigoPrincipal}
                      </div>
                      <div className="text-xs text-gray-400 font-mono mt-1">
                        ID: {product._id.toString().slice(-8)}
                      </div>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
                
                {/* Variación */}
                <td className="border p-2">
                  {variation ? (
                    <div>
                      <div className="font-medium">{variation.codigo}</div>
                      <div className="text-xs text-gray-400 font-mono mt-1">
                        ID: {variation._id.toString().slice(-8)}
                      </div>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
                
                {/* Medida */}
                <td className="border p-2">
                  {variation?.medida || "N/A"}
                </td>
                
                {/* Precio */}
                <td className="border p-2 font-mono text-sm">
                  {variation ? formatCurrency(variation.precio) : "N/A"}
                </td>
                
                {/* Tipo Movimiento */}
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
                
                {/* Cantidad */}
                <td
                  className={`border p-2 font-medium text-center ${
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
                
                {/* Stock Anterior */}
                <td className="border p-2 text-center">
                  {m.previousStock}
                </td>
                
                {/* Stock Nuevo */}
                <td className="border p-2 font-medium text-center">
                  {m.newStock}
                </td>
                
                {/* Razón */}
                <td className="border p-2 text-sm">
                  {m.reason}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Vista para tablets (md) */}
      <table className="hidden md:table lg:hidden w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Producto</th>
            <th className="border p-2">Variación</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Cantidad</th>
            <th className="border p-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => {
            const product = m.product;
            const variation = m.variation;
            
            return (
              <tr key={m._id.toString()} className="hover:bg-gray-50">
                <td className="border p-2 whitespace-nowrap text-xs">
                  {formatDate(m.createdAt.toString())}
                </td>
                <td className="border p-2">
                  {product ? (
                    <div>
                      <div className="font-semibold text-sm">{product.nombre}</div>
                      <div className="text-xs text-gray-500">{product.codigoPrincipal}</div>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="border p-2">
                  {variation ? (
                    <div>
                      <div className="text-sm">{variation.codigo}</div>
                      <div className="text-xs text-gray-500">{variation.medida}</div>
                    </div>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="border p-2">
                  <span
                    className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${m.type === "in" && "bg-green-100 text-green-800"}
                      ${m.type === "out" && "bg-red-100 text-red-800"}
                      ${m.type === "adjustment" && "bg-blue-100 text-blue-800"}
                    `}
                  >
                    {m.type === "in" && "+"}
                    {m.type === "out" && "-"}
                    {m.type === "adjustment" && "A"}
                  </span>
                </td>
                <td
                  className={`border p-2 font-medium text-center ${
                    m.type === "in"
                      ? "text-green-600"
                      : m.type === "out"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {m.quantity}
                </td>
                <td className="border p-2 text-center text-xs">
                  {m.previousStock} → {m.newStock}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Vista tipo card en mobile */}
      <div className="md:hidden space-y-3">
        {movements.map((m) => {
          const product = m.product;
          const variation = m.variation;
          
          return (
            <div
              key={m._id.toString()}
              className="border rounded-lg p-3 shadow-sm bg-white"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <span
                  className={`
                    px-2 py-1 rounded text-xs font-medium
                    ${m.type === "in" && "bg-green-100 text-green-800"}
                    ${m.type === "out" && "bg-red-100 text-red-800"}
                    ${m.type === "adjustment" && "bg-blue-100 text-blue-800"}
                  `}
                >
                  {m.type === "in" && "INGRESO"}
                  {m.type === "out" && "SALIDA"}
                  {m.type === "adjustment" && "AJUSTE"}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(m.createdAt.toString())}
                </span>
              </div>

              {/* Producto */}
              <div className="mb-2">
                <div className="font-semibold text-sm">
                  {product?.nombre || "Producto no disponible"}
                </div>
                <div className="text-xs text-gray-500">
                  Código: {product?.codigoPrincipal || "N/A"}
                </div>
              </div>

              {/* Variación */}
              {variation && (
                <div className="mb-2 p-2 bg-gray-50 rounded">
                  <div className="font-medium text-sm">{variation.codigo}</div>
                  <div className="text-xs text-gray-600">Medida: {variation.medida}</div>
                  <div className="text-xs text-green-600 font-semibold">
                    Precio: {formatCurrency(variation.precio)}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Stock Ant.</div>
                  <div className="font-medium">{m.previousStock}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Stock Nuevo</div>
                  <div className="font-medium">{m.newStock}</div>
                </div>
              </div>

              {/* Cantidad y Razón */}
              <div className="flex justify-between items-center">
                <span
                  className={`text-lg font-bold ${
                    m.type === "in"
                      ? "text-green-600"
                      : m.type === "out"
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                >
                  {m.type === "in" ? "+" : m.type === "out" ? "-" : ""}
                  {m.quantity}
                </span>
                <span className="text-xs text-gray-600 max-w-[50%] truncate">
                  {m.reason}
                </span>
              </div>

              {/* IDs (solo en debug o para admin) */}
              <div className="mt-2 text-xs text-gray-400 font-mono">
                {product && `Prod: ${product._id.toString().slice(-8)}`}
                {variation && ` | Var: ${variation._id.toString().slice(-8)}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}