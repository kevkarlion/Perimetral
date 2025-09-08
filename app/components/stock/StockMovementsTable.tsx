"use client";

import { IStockMovement } from "@/types/stockTypes";
import { Types } from "mongoose";
import { useState } from "react";

interface ExtendedStockMovement extends IStockMovement {
  product?: {
    _id: Types.ObjectId;
    nombre: string;
    codigoPrincipal: string;
  };
  variation?: {
    _id: Types.ObjectId;
    codigo: string;
    medida: string;
    precio: number;
    stock: number;
    stockMinimo: number;
    atributos: any;
    imagenes: any[];
    activo: boolean;
  };
  createdByUser?: any;
}

interface StockMovementsTableProps {
  movements: ExtendedStockMovement[];
  showRawIds?: boolean; // Nueva prop para mostrar IDs crudos
}

export default function StockMovementsTable({
  movements,
  showRawIds = false // Por defecto no mostrar IDs crudos
}: StockMovementsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  console.log('Movements in Table:', movements);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Función segura para obtener IDs
  const getSafeId = (id: any): string => {
    if (!id) return "N/A";
    if (typeof id === 'string') return id;
    if (id instanceof Types.ObjectId) return id.toString();
    if (id._id) return id._id.toString();
    return "N/A";
  };

  return (
    <div className="w-full overflow-x-auto">
      {/* Tabla visible en lg+ */}
      <table className="hidden lg:table w-full border-collapse border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Producto</th>
            <th className="border p-2">ID Producto</th>
            <th className="border p-2">Variación</th>
            <th className="border p-2">ID Variación</th>
            <th className="border p-2">Tipo Mov.</th>
            <th className="border p-2">Cantidad</th>
            <th className="border p-2">Stock Ant.</th>
            <th className="border p-2">Stock Nuevo</th>
            <th className="border p-2">Razón</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((m) => {
            const productId = getSafeId(m.productId);
            const variationId = getSafeId(m.variation?._id);
            
            return (
              <tr key={getSafeId(m._id)} className="hover:bg-gray-50">
                {/* Fecha */}
                <td className="border p-2 whitespace-nowrap text-xs">
                  {formatDate(m.createdAt.toString())}
                </td>
                
                {/* Producto - Nombre */}
                <td className="border p-2">
                  {m.product ? (
                    <div>
                      <div className="font-semibold">{m.product.nombre}</div>
                      <div className="text-xs text-gray-500">
                        {m.product.codigoPrincipal}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">ID: {productId.slice(0, 8)}...</span>
                  )}
                </td>
                
                {/* Producto - ID */}
                <td className="border p-2">
                  <div className="relative">
                    <button
                      onClick={() => copyToClipboard(productId, `prod-${getSafeId(m._id)}`)}
                      className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-all bg-blue-50 px-2 py-1 rounded w-full text-left truncate"
                      title="Haz clic para copiar el ID completo"
                    >
                      {showRawIds ? productId : `${productId.slice(0, 8)}...`}
                    </button>
                    {copiedId === `prod-${getSafeId(m._id)}` && (
                      <span className="absolute -top-7 left-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        ¡Copiado!
                      </span>
                    )}
                  </div>
                </td>
                
                {/* Variación - Código */}
                <td className="border p-2">
                  {m.variation ? (
                    <div>
                      <div className="font-medium">{m.variation.codigo}</div>
                      <div className="text-xs text-gray-500">{m.variation.medida}</div>
                    </div>
                  ) : (
                    <span className="text-gray-500">ID:{variationId}</span>
                  )}
                </td>
                
                {/* Variación - ID */}
                <td className="border p-2">
                  <div className="relative">
                    <button
                      onClick={() => copyToClipboard(variationId, `var-${getSafeId(m._id)}`)}
                      className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-all bg-blue-50 px-2 py-1 rounded w-full text-left truncate"
                      title="Haz clic para copiar el ID completo"
                    >
                      {showRawIds ? variationId : `${variationId}`}
                    </button>
                    {copiedId === `var-${getSafeId(m._id)}` && (
                      <span className="absolute -top-7 left-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        ¡Copiado!
                      </span>
                    )}
                  </div>
                </td>
                
                {/* Tipo Movimiento */}
                <td className="border p-2">
                  <span
                    className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${m.type === "in" && "bg-green-100 text-green-800"}
                      ${m.type === "out" && "bg-red-100 text-red-800"}
                      ${m.type === "adjustment" && "bg-blue-100 text-blue-800"}
                    `}
                  >
                    {m.type === "in" && "Ingreso"}
                    {m.type === "out" && "Salida"}
                    {m.type === "adjustment" && "Ajuste"}
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

      {/* Mensaje si no hay movimientos */}
      {movements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay movimientos de stock para mostrar
        </div>
      )}
    </div>
  );
}