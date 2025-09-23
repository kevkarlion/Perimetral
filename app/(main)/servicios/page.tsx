import Image from "next/image";
import ServiciosSection from "@/app/components/ServiciosSection/ServiciosSection";
import { FaWhatsapp } from "react-icons/fa";

export default function ServiciosPage() {
  return (
    <div className="bg-white">
      {/* Hero Section con video y logo */}
      <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <video
          src="/videos/video-hero-proyects.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Overlay para contraste */}
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
                Nuestros especialistas están disponibles para responder todas tus
                consultas y asesorarte en cada etapa del proyecto.
              </p>
              <a
                href="https://wa.me/5492984392148?text=Hola,%20me%20gustaría%20solicitar%20información%20sobre%20sus%20cercos%20perimetrales"
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
