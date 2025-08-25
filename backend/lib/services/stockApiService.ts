// backend/lib/services/stockApiService.ts
interface StockUpdateRequest {
  productId: string;
  stock: number;
  variationId?: string;
  action: 'set' | 'increment' | 'decrement';
}

export async function updateStockViaApi(request: StockUpdateRequest) {
  try {
    const response = await fetch('/api/stock', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating stock via API:', error);
    throw new Error('Error al actualizar el stock a través de la API');
  }
}