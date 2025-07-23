// app/catalogo/[id]/page.tsx
import ProductId from '@/components/ProductId/ProductId'

export default async function Page({ params }: { params: { id: string } }) {
  // 1. Obtener el producto en el servidor
  const res = await fetch(`http://localhost:3000/api/stock/${params.id}`)
  const { data: product } = await res.json()

  if (!product) {
    return <div>Producto no encontrado</div>
  }

  // 2. Pasar el producto ya obtenido al componente
  return <ProductId initialProduct={product} />
}