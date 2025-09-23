"use client";

import Image from "next/image";
import { useState } from "react";

interface Media {
  id: number;
  type: "image" | "video";
  src: string;
  alt?: string;
}

const servicios = [
  {
    id: 1,
    titulo: "Cercos Perimetrales",
    descripcion:
      "Fabricamos e instalamos cercos robustos, resistentes al clima patagónico y de máxima seguridad.",
  },
  {
    id: 2,
    titulo: "Portones a Medida",
    descripcion:
      "Portones metálicos diseñados y fabricados a medida, adaptados a tu espacio y necesidad.",
  },
  {
    id: 3,
    titulo: "Emprolijado del Terreno",
    descripcion:
      "Contamos con maquinaria para preparar y nivelar el suelo antes de la instalación.",
  },
];

const media: Media[] = [
  {
    id: 1,
    type: "image",
    src: "/servicios/img1.webp",
    alt: "Instalación de cercos",
  },
  {
    id: 2,
    type: "image",
    src: "/servicios/img2.webp",
    alt: "Portones metálicos",
  },
  { id: 3, type: "video", src: "/videos/video2-proyects.mp4" },
  {
    id: 4,
    type: "image",
    src: "/servicios/img3.webp",
    alt: "Maquinaria en acción",
  },
  {
    id: 5,
    type: "image",
    src: "/servicios/img4.webp",
    alt: "Terreno nivelado",
  },
  {
    id: 6,
    type: "image",
    src: "/servicios/img5.webp",
    alt: "Terreno nivelado",
  },
  { id: 7, type: "video", src: "/videos/video3-proyects.mp4" },
  {
    id: 8,
    type: "image",
    src: "/servicios/img6.webp",
    alt: "Terreno nivelado",
  },
];

export default function ServiciosSection() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <section className="container mx-auto px-4 py-16 max-w-6xl">
      {/* Encabezado */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Nuestros Servicios
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Ofrecemos soluciones completas en seguridad perimetral, adaptadas a
          cada necesidad y terreno.
        </p>
      </div>

      {/* Descripción de servicios */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {servicios.map((servicio) => (
          <div
            key={servicio.id}
            className="bg-gradient-to-r from-[#FFD700] to-yellow-500 p-0.5 rounded-xl shadow-md"
          >
            <div className="bg-white rounded-xl p-6 h-full text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {servicio.titulo}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {servicio.descripcion}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Galería estilo masonry */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
        {media.map((item) =>
          item.type === "image" ? (
            <div
              key={item.id}
              className="relative w-full overflow-hidden rounded-xl"
            >
              <Image
                src={item.src}
                alt={item.alt || ""}
                width={600}
                height={400}
                className="w-full h-auto object-cover rounded-xl"
              />
            </div>
          ) : (
            <div
              key={item.id}
              className="relative cursor-pointer overflow-hidden rounded-xl"
              onClick={() => setSelectedVideo(item.src)}
            >
              <video
                src={item.src}
                className="w-full h-auto rounded-xl"
                muted
                loop
                autoPlay
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-lg">
                ▶ Ver Video
              </div>
            </div>
          )
        )}
      </div>

      {/* Modal para video */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedVideo(null)}
        >
          <video
            src={selectedVideo}
            controls
            autoPlay
            className="max-w-3xl w-full rounded-xl shadow-xl"
          />
        </div>
      )}
    </section>
  );
}
