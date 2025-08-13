// app/(main)/catalogo/variants/[id]/page.tsx
import { notFound } from "next/navigation";
import Product from "@/backend/lib/models/Product";
import ProductId from "@/app/components/ProductId/ProductId";
import { dbConnect } from "@/backend/lib/dbConnect/dbConnect";
import { Types } from "mongoose";

// interface PageProps {
//   params: {
//     id: string;
//   };
//   searchParams: {
//     productId?: string;
//   };
// }

//convertir a objeto plano
function deepConvertToPlain(obj: any): any {
  if (obj == null) return obj;
  if (obj instanceof Types.ObjectId) return obj.toString();
  if (obj instanceof Date) return obj.toISOString();
  if (obj instanceof Buffer) return obj.toString("base64");
  if (Array.isArray(obj)) return obj.map(deepConvertToPlain);
  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, deepConvertToPlain(v)])
    );
  }
  return obj;
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    // ⚠️ Next.js 15: params es una promesa
    const params = await props.params;
    const id = params.id;

    // Buscar el producto que contiene la variante
    const productDoc = await Product.findOne({
      "variaciones._id": new Types.ObjectId(id),
    }).exec();

    if (!productDoc) return notFound();

    // Convertir todo el documento a un objeto plano sin nada de Mongoose
    const productPlain = deepConvertToPlain(productDoc.toObject());

    // Buscar variante
    const variant = productPlain.variaciones.find((v: any) => v._id === id);
    if (!variant) return notFound();

    // Crear producto combinado plano
    const combinedProduct = {
      ...productPlain,
      precio: variant.precio,
      stock: variant.stock,
      medidaSeleccionada: variant.medida,
      variaciones: productPlain.variaciones.map((v: any) => ({
        ...v,
        medida: v.medida,
      })),
      ...(variant.atributos && { atributos: variant.atributos }),
      especificacionesTecnicas: productPlain.especificacionesTecnicas || [],
      caracteristicas: productPlain.caracteristicas || [],
      imagenesGenerales: productPlain.imagenesGenerales || [],
    };

    console.log("Medida enviada:", variant.medida);

    return (
      <ProductId initialProduct={combinedProduct} initialVariationId={id} />
    );
  } catch (error) {
    console.error("Error loading variant:", error);
    return notFound();
  }
}
