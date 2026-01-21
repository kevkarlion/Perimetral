import { ProductClient } from "@/app/components/product-client/product-client"

async function getProduct(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${slug}`,
    { cache: "no-store" }
  )

  if (!res.ok) return null
  return res.json()
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const result = await getProduct(params.slug)
  if (!result?.data) return null

  return <ProductClient product={result.data} />
}
