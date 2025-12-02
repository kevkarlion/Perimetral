// app/(main)/catalogo/variants/page.tsx
import VariantPage from "@/app/components/VariantPage/VariantPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({
  searchParams,  // ← CAMBIAR params por searchParams
}: {
  searchParams: Promise<{ productId?: string; productName?: string }>;
}) {
  // Obtener los parámetros de la query string
  const params = await searchParams;
  const productId = params.productId;  // ← Ahora viene de ?productId=
  const productName = params.productName;
  
  console.log("Product ID from query:", productId); // Para debug
  console.log("Product Name from query:", productName); // Para debug
  
  const URL = process.env.BASE_URL;

  // Verificación más robusta de la URL
  if (!URL) {
    console.error("BASE_URL no está definida en las variables de entorno");
    return <VariantPage initialProduct={null} />;
  }

  // Si no hay productId, mostrar error
  if (!productId) {
    console.error("No productId provided in query parameters");
    return <VariantPage initialProduct={null} />;
  }

  // Asegurarse de que la URL tenga el formato correcto
  const baseUrl = URL.replace(/\/$/, ""); // Remover slash final si existe
  const apiUrl = `${baseUrl}/api/stock/${productId}`;  // ← Usar productId

  try {
    console.log("Fetching from:", apiUrl); // Para debug

    const res = await fetch(apiUrl, {
      cache: "no-store",
      // Agregar timeout para evitar hanging requests
    });

    if (!res.ok) {
      console.error(`Error ${res.status}: ${res.statusText}`);
      return <VariantPage initialProduct={null} />;
    }

    const { data: product } = await res.json();
    return <VariantPage initialProduct={product} />;
  } catch (error) {
    console.error("Error fetching product:", error);
    return <VariantPage initialProduct={null} />;
  }
}