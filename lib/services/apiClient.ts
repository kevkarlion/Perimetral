// lib/services/apiClient.ts

export async function fetchProducts() {
  const res = await fetch('/api/stock');

  if (!res.ok) throw new Error('Error al obtener productos');
  return res.json();
}

export async function fetchOrders() {
  const res = await fetch('/api/orders');
  if (!res.ok) throw new Error('Error al obtener órdenes');
  return res.json();
}
 export async function deleteProduct(id: string) {
  const res = await fetch(`/api/stock?id=${id}`, {
    method: 'DELETE',
  });
    if (!res.ok) throw new Error('Error al eliminar producto');
    return res.json();
  }


  export async function createProduct(product: any) {
    const res = await fetch('/api/stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Error al crear producto');
    return res.json();
  }

  export async function updateProduct(id: string, product: any) {
    const res = await fetch(`/api/stock?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Error al actualizar producto');
    return res.json();
  }