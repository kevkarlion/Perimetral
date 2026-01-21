import Link from "next/link"

export function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/producto/${product.slug}`}>
      <article className="border p-4 rounded">
        <h3>{product.nombre}</h3>
        <p>{product.descripcionCorta}</p>
      </article>
    </Link>
  )
}
