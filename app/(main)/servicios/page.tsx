"use client";

import Image from "next/image";
import ServiciosSection from "@/app/components/ServiciosSection/ServiciosSection";
import { FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

export default function ServiciosPage() {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <div className="bg-white">
      {/* Hero Section con primer frame y logo */}
      <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        {/* Primer frame como placeholder */}
        {!videoReady && (
          <Image
            src="/videos/img-video.jpg" // captura del primer frame
            alt="Hero placeholder"
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Video de fondo */}
        <video
          src="/videos/video-hero-proyects.mp4"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
        />

        {/* Overlay oscuro para contraste */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="relative z-10">
            <Image
              src="/Logos/Logo-mobile.png"
              alt="Logo de la empresa"
              width={250}
              height={80}
              className="mx-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* Sección de Servicios */}
      <ServiciosSection />

      {/* Sección de contacto */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Borde con gradiente */}
          <div className="bg-gradient-to-r from-brand to-brand-dark p-0.5 rounded-2xl shadow-lg">
            <div className="bg-white rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Necesitas más información?
              </h3>
              <p className="text-gray-600 mb-6 max-w-xl mx-auto text-base">
                Nuestros especialistas están disponibles para responder todas
                tus consultas y asesorarte en cada etapa del proyecto.
              </p>
              <a
                href="https://wa.me/5492984392148"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brandHover text-white font-semibold py-3 px-8 rounded-lg transition-all shadow-sm hover:shadow-md text-base"
              >
                <FaWhatsapp className="w-5 h-5" />
                Contactar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
