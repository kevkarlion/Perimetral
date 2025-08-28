"use client";

import { useEffect, useState } from "react";
import { useStock } from "@/app/components/hooks/useStock";
import { StockLevel } from "@/types/stockTypes";

export default function LowStockTable() {
  const { getLowStock } = useStock();
  const [lowStock, setLowStock] = useState<StockLevel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLowStock = async () => {
      setIsLoading(true);
      const data = await getLowStock();
      setLowStock(data);
      setIsLoading(false);
    };

    fetchLowStock();
  }, []);

  if (isLoading) return <div>Cargando...</div>;

  return (
    <section id="low-stock" className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Productos con Bajo Stock</h2>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-2">ID del Producto</th>
              <th className="p-2">Stock Actual</th>
              <th className="p-2">Stock Mínimo</th>
              <th className="p-2">Variación</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.map((item) => (
              <tr
                key={`${item.productId?.toString()}-${item.variationId?.toString()}`}
                className="border-b"
              >
                <td className="p-2">{item.productId?.toString()}</td>
                <td className="p-2">{item.currentStock}</td>
                <td className="p-2">{item.minimumStock}</td>
                <td className="p-2">
                  {item.variationId
                    ? `Variación: ${item.variationId.toString()}`
                    : "Sin variación"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
