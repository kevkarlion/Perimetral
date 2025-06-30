import orderService from '@/lib/services/orderService';

export async function getAllOrders() {
  try {
    const orders = await orderService.getAllOrders();
    return new Response(JSON.stringify(orders), { status: 200 });
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    return new Response('Error al obtener órdenes', { status: 500 });
  }
}

export async function createOrder(req: Request) {
  try {
    const body = await req.json();
    // Aquí podés agregar validaciones si querés
    const created = await orderService.createOrder(body);
    return new Response(JSON.stringify(created), { status: 201 });
  } catch (error) {
    console.error('Error al crear orden:', error);
    return new Response('Error al crear orden', { status: 500 });
  }
}

export async function deleteOrderById(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return new Response('ID requerido', { status: 400 });

    await orderService.deleteOrder(id);
    return new Response('Orden eliminada', { status: 200 });
  } catch (error) {
    console.error('Error al eliminar orden:', error);
    return new Response('Error al eliminar orden', { status: 500 });
  }
}
