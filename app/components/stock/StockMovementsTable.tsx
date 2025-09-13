"use client";

import { IStockMovement } from "@/types/stockTypes";
import { Types } from "mongoose";
import { useState } from "react";

interface ExtendedStockMovement extends IStockMovement {
  // Campos originales (mantenidos por compatibilidad)
  product?: {
    _id: Types.ObjectId;
    nombre: string;
    codigoPrincipal: string;
    categoria?: string;
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
  
  // NUEVOS CAMPOS - Información rápida
  productName?: string;
  productCode?: string;
  categoryName?: string;
  variationName?: string;
  variationCode?: string;
}

interface StockMovementsTableProps {
  movements: ExtendedStockMovement[];
  showRawIds?: boolean;
}

export default function StockMovementsTable({
  movements,
  showRawIds = false
}: StockMovementsTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);


  console.log('Movimientos recibidos en StockMovementsTable:', movements);
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSafeId = (id: any): string => {
    if (!id) return "N/A";
    if (typeof id === 'string') return id;
    if (id instanceof Types.ObjectId) return id.toString();
    if (id._id) return id._id.toString();
    return "N/A";
  };

  const getMovementType = (type: string) => {
    switch (type) {
      case "in": return "Ingreso";
      case "out": return "Salida";
      case "adjustment": return "Ajuste";
      case "transfer": return "Transferencia";
      case "initial": return "Inicial";
      default: return type;
    }
  };

  // Función para obtener información del producto (usa nuevos campos primero)
  const getProductInfo = (movement: ExtendedStockMovement) => {
    return {
      nombre: movement.productName || movement.product?.nombre || 'N/A',
      codigo: movement.productCode || movement.product?.codigoPrincipal || 'N/A',
      categoria: movement.categoryName || movement.product?.categoria || 'N/A'
    };
  };

  // Función para obtener información de la variación (usa nuevos campos primero)
  const getVariationInfo = (movement: ExtendedStockMovement) => {
    if (!movement.variationId && !movement.variation) return null;
    
    return {
      nombre: movement.variationName || movement.variation?.codigo || 'N/A',
      codigo: movement.variationCode || movement.variation?.codigo || 'N/A',
      medida: movement.variation?.medida || 'N/A'
    };
  };

  console.log('Movimientos recibidos en StockMovementsTable:', movements);

  return (
    <div className="w-full">
      {/* Tabla optimizada para desktop (lg en adelante) */}
      <div className="hidden lg:block">
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left font-medium text-gray-700 whitespace-nowrap">Fecha</th>
                <th className="p-3 text-left font-medium text-gray-700 whitespace-nowrap">Producto</th>
                <th className="p-3 text-left font-medium text-gray-700 whitespace-nowrap">Categoría</th>
                <th className="p-3 text-left font-medium text-gray-700 whitespace-nowrap">ID Producto</th>
                <th className="p-3 text-left font-medium text-gray-700 whitespace-nowrap">Variación</th>
                <th className="p-3 text-left font-medium text-gray-700 whitespace-nowrap">ID Variación</th>
                <th className="p-3 text-left font-medium text-gray-700 whitespace-nowrap">Tipo</th>
                <th className="p-3 text-center font-medium text-gray-700 whitespace-nowrap">Cantidad</th>
                <th className="p-3 text-center font-medium text-gray-700 whitespace-nowrap">Stock Ant.</th>
                <th className="p-3 text-center font-medium text-gray-700 whitespace-nowrap">Stock Nuevo</th>
                <th className="p-3 text-left font-medium text-gray-700 whitespace-nowrap">Razón</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {movements.map((m) => {
                const productId = getSafeId(m.productId);
                const variationId = getSafeId(m.variationId);
                const movementId = getSafeId(m._id);
                const productInfo = getProductInfo(m);
                const variationInfo = getVariationInfo(m);
                
                return (
                  <tr key={movementId} className="hover:bg-gray-50 transition-colors">
                    {/* Fecha */}
                    <td className="p-3 whitespace-nowrap text-xs text-gray-600">
                      {formatDate(m.createdAt.toString())}
                    </td>
                    
                    {/* Producto - Nombre y Código */}
                    <td className="p-3 max-w-[180px]">
                      <div className="truncate">
                        <div className="font-medium text-gray-900 truncate" title={productInfo.nombre}>
                          {productInfo.nombre}
                        </div>
                        <div className="text-xs text-gray-500 truncate" title={productInfo.codigo}>
                          {productInfo.codigo}
                        </div>
                      </div>
                    </td>
                    
                    {/* Categoría */}
                    <td className="p-3 max-w-[120px]">
                      <div className="text-xs text-gray-600 truncate" title={productInfo.categoria}>
                        {productInfo.categoria}
                      </div>
                    </td>
                    
                    {/* Producto - ID */}
                    <td className="p-3">
                      <div className="relative max-w-[100px]">
                        <button
                          onClick={() => copyToClipboard(productId, `prod-${movementId}`)}
                          className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-all bg-blue-50 px-2 py-1 rounded w-full text-left truncate"
                          title="Haz clic para copiar el ID completo"
                        >
                          {showRawIds ? productId : `${productId.slice(0, 8)}...`}
                        </button>
                        {copiedId === `prod-${movementId}` && (
                          <span className="absolute -top-7 left-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded shadow-sm">
                            ¡Copiado!
                          </span>
                        )}
                      </div>
                    </td>
                    
                    {/* Variación - Nombre y Código */}
                    <td className="p-3 max-w-[120px]">
                      {variationInfo ? (
                        <div className="truncate">
                          <div className="font-medium text-gray-900 truncate" title={variationInfo.nombre}>
                            {variationInfo.nombre}
                          </div>
                          <div className="text-xs text-gray-500 truncate" title={variationInfo.codigo}>
                            {variationInfo.codigo}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs">Sin variación</span>
                      )}
                    </td>
                    
                    {/* Variación - ID */}
                    <td className="p-3">
                      <div className="relative max-w-[100px]">
                        {variationId !== "N/A" ? (
                          <>
                            <button
                              onClick={() => copyToClipboard(variationId, `var-${movementId}`)}
                              className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-all bg-blue-50 px-2 py-1 rounded w-full text-left truncate"
                              title="Haz clic para copiar el ID completo"
                            >
                              {showRawIds ? variationId : `${variationId.slice(0, 8)}...`}
                            </button>
                            {copiedId === `var-${movementId}` && (
                              <span className="absolute -top-7 left-0 bg-green-100 text-green-800 text-xs px-2 py-1 rounded shadow-sm">
                                ¡Copiado!
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs">N/A</span>
                        )}
                      </div>
                    </td>
                    
                    {/* Tipo Movimiento */}
                    <td className="p-3">
                      <span
                        className={`
                          px-2 py-1 rounded text-xs font-medium whitespace-nowrap
                          ${m.type === "in" && "bg-green-100 text-green-800"}
                          ${m.type === "out" && "bg-red-100 text-red-800"}
                          ${m.type === "adjustment" && "bg-blue-100 text-blue-800"}
                          ${m.type === "transfer" && "bg-purple-100 text-purple-800"}
                          ${m.type === "initial" && "bg-gray-100 text-gray-800"}
                        `}
                      >
                        {getMovementType(m.type)}
                      </span>
                    </td>
                    
                    {/* Cantidad */}
                    <td
                      className={`p-3 font-medium text-center whitespace-nowrap ${
                        m.type === "in" || m.type === "initial"
                          ? "text-green-600"
                          : m.type === "out"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {m.type === "in" || m.type === "initial" ? "+" : m.type === "out" ? "-" : ""}
                      {m.quantity}
                    </td>
                    
                    {/* Stock Anterior */}
                    <td className="p-3 text-center text-gray-600 whitespace-nowrap">
                      {m.previousStock}
                    </td>
                    
                    {/* Stock Nuevo */}
                    <td className="p-3 font-medium text-center text-gray-900 whitespace-nowrap">
                      {m.newStock}
                    </td>
                    
                    {/* Razón */}
                    <td className="p-3 text-sm text-gray-700 max-w-[200px] truncate" title={m.reason}>
                      {m.reason}
                      {m.notes && (
                        <div className="text-xs text-gray-500 mt-1" title={m.notes}>
                          {m.notes.length > 50 ? `${m.notes.substring(0, 50)}...` : m.notes}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vista para tablet (md) */}
      <div className="hidden md:block lg:hidden">
        <div className="space-y-3">
          {movements.map((m) => {
            const productId = getSafeId(m.productId);
            const variationId = getSafeId(m.variationId);
            const movementId = getSafeId(m._id);
            const productInfo = getProductInfo(m);
            const variationInfo = getVariationInfo(m);
            
            return (
              <div key={movementId} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Fecha</div>
                    <div className="text-sm font-medium">{formatDate(m.createdAt.toString())}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Tipo</div>
                    <span
                      className={`
                        px-2 py-1 rounded text-xs font-medium
                        ${m.type === "in" && "bg-green-100 text-green-800"}
                        ${m.type === "out" && "bg-red-100 text-red-800"}
                        ${m.type === "adjustment" && "bg-blue-100 text-blue-800"}
                        ${m.type === "transfer" && "bg-purple-100 text-purple-800"}
                        ${m.type === "initial" && "bg-gray-100 text-gray-800"}
                      `}
                    >
                      {getMovementType(m.type)}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Producto</div>
                    <div className="text-sm font-medium truncate" title={productInfo.nombre}>
                      {productInfo.nombre}
                    </div>
                    <div className="text-xs text-gray-500 truncate" title={productInfo.codigo}>
                      {productInfo.codigo}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Categoría</div>
                    <div className="text-sm text-gray-600 truncate" title={productInfo.categoria}>
                      {productInfo.categoria}
                    </div>
                  </div>
                  {variationInfo && (
                    <>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Variación</div>
                        <div className="text-sm font-medium truncate" title={variationInfo.nombre}>
                          {variationInfo.nombre}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Código Var.</div>
                        <div className="text-sm text-gray-600 truncate" title={variationInfo.codigo}>
                          {variationInfo.codigo}
                        </div>
                      </div>
                    </>
                  )}
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Cantidad</div>
                    <div
                      className={`text-sm font-medium ${
                        m.type === "in" || m.type === "initial"
                          ? "text-green-600"
                          : m.type === "out"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {m.type === "in" || m.type === "initial" ? "+" : m.type === "out" ? "-" : ""}
                      {m.quantity}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Stock</div>
                    <div className="text-sm font-medium">
                      {m.previousStock} → {m.newStock}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-xs text-gray-500 mb-1">Razón</div>
                    <div className="text-sm text-gray-700 break-words" title={m.reason}>
                      {m.reason}
                    </div>
                    {m.notes && (
                      <div className="text-xs text-gray-500 mt-1" title={m.notes}>
                        {m.notes.length > 50 ? `${m.notes.substring(0, 50)}...` : m.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vista para móviles (sm) */}
      <div className="md:hidden">
        <div className="space-y-3">
          {movements.map((m) => {
            const productId = getSafeId(m.productId);
            const variationId = getSafeId(m.variationId);
            const movementId = getSafeId(m._id);
            const productInfo = getProductInfo(m);
            const variationInfo = getVariationInfo(m);
            
            return (
              <div key={movementId} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${m.type === "in" && "bg-green-100 text-green-800"}
                      ${m.type === "out" && "bg-red-100 text-red-800"}
                      ${m.type === "adjustment" && "bg-blue-100 text-blue-800"}
                      ${m.type === "transfer" && "bg-purple-100 text-purple-800"}
                      ${m.type === "initial" && "bg-gray-100 text-gray-800"}
                    `}
                  >
                    {getMovementType(m.type)}
                  </span>
                  <div className="text-xs text-gray-500">{formatDate(m.createdAt.toString())}</div>
                </div>
                
                <div className="mb-2">
                  <div className="text-xs text-gray-500">Producto</div>
                  <div className="text-sm font-medium truncate" title={productInfo.nombre}>
                    {productInfo.nombre}
                  </div>
                  <div className="text-xs text-gray-500 truncate" title={productInfo.codigo}>
                    {productInfo.codigo}
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className="text-xs text-gray-500">Categoría</div>
                  <div className="text-sm text-gray-600 truncate" title={productInfo.categoria}>
                    {productInfo.categoria}
                  </div>
                </div>
                
                {variationInfo && (
                  <div className="mb-2">
                    <div className="text-xs text-gray-500">Variación</div>
                    <div className="text-sm font-medium truncate" title={variationInfo.nombre}>
                      {variationInfo.nombre}
                    </div>
                    <div className="text-xs text-gray-500 truncate" title={variationInfo.codigo}>
                      {variationInfo.codigo}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="text-xs text-gray-500">Cantidad</div>
                    <div
                      className={`text-sm font-medium ${
                        m.type === "in" || m.type === "initial"
                          ? "text-green-600"
                          : m.type === "out"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {m.type === "in" || m.type === "initial" ? "+" : m.type === "out" ? "-" : ""}
                      {m.quantity}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500">Stock</div>
                    <div className="text-sm font-medium">
                      {m.previousStock} → {m.newStock}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500">Razón</div>
                  <div className="text-sm text-gray-700 break-words" title={m.reason}>
                    {m.reason}
                  </div>
                  {m.notes && (
                    <div className="text-xs text-gray-500 mt-1" title={m.notes}>
                      {m.notes.length > 50 ? `${m.notes.substring(0, 50)}...` : m.notes}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mensaje si no hay movimientos */}
      {movements.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
          <div className="text-xl mb-2">📦</div>
          <div>No hay movimientos de stock para mostrar</div>
        </div>
      )}
    </div>
  );
}