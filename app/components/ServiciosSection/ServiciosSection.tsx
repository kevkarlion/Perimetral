"use client";

import Image from "next/image";

const servicios = [
  {
    id: 1,
    titulo: "Cercos Perimetrales",
    descripcion:
      "Fabricamos e instalamos cercos robustos, resistentes al clima patagónico y de máxima seguridad.",
    imagen: "/servicio1.jpg", // reemplazalo con tu imagen
  },
  {
    id: 2,
    titulo: "Portones y Accesorios",
    descripcion:
      "Portones metálicos y complementos diseñados para integrarse a tu sistema perimetral.",
    imagen: "/servicio2.jpg",
  },
  {
    id: 3,
    titulo: "Asesoramiento Personalizado",
    descripcion:
      "Te acompañamos en cada paso, desde la elección del producto hasta la instalación.",
    imagen: "/servicio3.jpg",
  },
];

export default function ServiciosSection() {
  return (
    <section className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Nuestros Servicios
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Ofrecemos soluciones completas en seguridad perimetral, adaptadas a
          cada necesidad y terreno.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {servicios.map((servicio) => (
          <div
            key={servicio.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
          >
            <div className="relative h-56 w-full">
              <Image
                src={servicio.imagen}
                alt={servicio.titulo}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {servicio.titulo}
              </h3>
              <p className="text-gray-600">{servicio.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
