"use client";

import { useState, useEffect } from "react";
import {
  IStockMovement,
  StockMovementFilter,
  StockLevel,
} from "@/types/stockTypes";

export function useStock() {
  const [movements, setMovements] = useState<IStockMovement[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 20,
  });

  const fetchMovements = async (filters: StockMovementFilter = {}) => {
    setLoading(true);
    const params = new URLSearchParams(filters as any).toString();
    const res = await fetch(`/api/movement-stock?${params}`);
    const data = await res.json();
    console.log("data de movimientos de stock", data.data);
    if (data.success) {
      setMovements(data.data);
      setPagination(data.pagination);
    }
    setLoading(false);
  };

  const createMovement = async (payload: any) => {
    const res = await fetch("/api/movement-stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  };

  const getCurrentStock = async (
    productId: string,
    variationId?: string
  ): Promise<StockLevel | null> => {
    const params = new URLSearchParams({
      productId,
      variationId: variationId || "",
    });
    const res = await fetch(`/api/movement-stock/current?${params}`);
    const data = await res.json();
    return data.success ? data.data : null;
  };

  const getLowStock = async (threshold = 5): Promise<StockLevel[]> => {
    const res = await fetch(
      `/api/movement-stock/low-stock?threshold=${threshold}`
    );
    const data = await res.json();
    return data.success ? data.data : [];
  };

  return {
    movements,
    loading,
    pagination,
    fetchMovements,
    createMovement,
    getCurrentStock,
    getLowStock,
  };
}
