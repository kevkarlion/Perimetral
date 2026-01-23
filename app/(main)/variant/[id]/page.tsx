"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IVariation } from "@/types/ProductFormData";
import { useCartStore } from "@/app/components/store/cartStore";

export default function VariantDetailPage() {
  const { id } = useParams(); // viene de /variant/[id]
  const [variation, setVariation] = useState<IVariation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCartStore();

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/api/variations/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setVariation(data.data);
        } else {
          setError("No se pudo cargar la variación");
        }
      })
      .catch(() => setError("Error al cargar la variación"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="mt-10 ml-10">Cargando...</p>;
  if (error) return <p className="mt-10 ml-10 text-red-500">{error}</p>;
  if (!variation) return <p className="mt-10 ml-10">Variación no encontrada</p>;

  const handleAddToCart = () => {
  if (!variation) return;

  try {
    addToCart(variation); // 🔹 Le pasamos la IVariation completa
    alert("Producto agregado al carrito");
  } catch (error: any) {
    alert(error.message);
  }
};


  return (
    <div className="mt-24 p-10 grid md:grid-cols-2 gap-10">
      {/* Imagen */}
      <img
        src={variation.imagenes?.[0] || "/placeholder.png"}
        className="w-full h-[400px] object-cover rounded"
        alt={variation.nombre}
      />

      {/* Info */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-3">{variation.nombre}</h1>
        <p className="text-xl mb-2">${variation.precio.toLocaleString()}</p>
        {variation.stock !== undefined && (
          <p className="mb-4 text-gray-600">Stock: {variation.stock}</p>
        )}
        {variation.medida && (
          <p className="mb-2 text-gray-600">
            Medida: {variation.medida} {variation.uMedida}
          </p>
        )}
        {variation.atributos && variation.atributos.length > 0 && (
          <p className="mb-4 text-gray-600">
            {variation.atributos.map((a) => `${a.nombre}: ${a.valor}`).join(", ")}
          </p>
        )}

        <button
          onClick={handleAddToCart}
          className="bg-brand text-white px-6 py-3 rounded hover:bg-brandHover transition mt-auto"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}
