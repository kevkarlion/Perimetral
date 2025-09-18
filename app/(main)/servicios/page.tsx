import Image from "next/image";
import ServiciosSection from "@/app/components/ServiciosSection/ServiciosSection";

export default function ServiciosPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full">
        <Image
          src="/panoramica-servicios.webp" // poné tu imagen
          alt="Servicios de seguridad perimetral"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Nuestros Servicios
            </h1>
          </div>
        </div>
      </section>

      {/* Sección de Servicios */}
      <ServiciosSection />
    </div>
  );
}
