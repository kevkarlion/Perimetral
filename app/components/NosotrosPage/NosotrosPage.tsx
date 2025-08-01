import Image from 'next/image';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';

export default function NosotrosPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full">
        <Image
          src="/panoramica-completo.webp"
          alt="Fábrica de cercos perimetrales en Neuquén"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Expertos en Seguridad Perimetral
            </h1>
          </div>
        </div>
      </section>

      {/* Contenido Principal */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="prose prose-lg text-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Nuestra Historia y Compromiso
          </h2>

          <p>
            En <strong>PERIMETRAL</strong> nos dedicamos a la fabricación e instalación de sistemas de protección perimetral pensados para brindar tranquilidad, durabilidad y confianza. Estamos ubicados en <strong>General Roca, Río Negro</strong>, lo que nos permite estar cerca de nuestros clientes y responder rápidamente a cada necesidad.
          </p>

          <p>
            Realizamos <strong>envíos gratuitos a General Roca, Cipolletti y Neuquén</strong>, lo que facilita el acceso a nuestros productos sin costos ocultos ni sorpresas. Sabemos que en nuestra región el clima y las condiciones del terreno pueden ser desafiantes, por eso diseñamos productos robustos, resistentes al viento, la lluvia y las variaciones extremas de temperatura.
          </p>

          <p>
            Además, entendemos que elegir un sistema de protección es una decisión importante. Por eso ofrecemos asesoramiento honesto, adaptado a cada situación, y un servicio postventa que nos diferencia. Estamos acá para acompañarte, desde la primera consulta hasta mucho después de la instalación.
          </p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            ¿Por qué elegirnos?
          </h3>

          <ul className="space-y-3">
            <li>Fabricación propia con materiales de primera calidad</li>
            <li>Instalación profesional, sin tercerizados</li>
            <li>Diseños adaptados al clima y terreno de la Patagonia</li>
            <li>Envíos gratis a General Roca, Cipolletti y Neuquén</li>
            <li>Asesoramiento claro y personalizado para cada cliente</li>
            <li>Garantía real y respaldo local</li>
          </ul>
        </div>


        {/* CTA y Redes Sociales */}
       <div className="mt-16 bg-gradient-to-r from-brand to-brand-dark p-0.5 rounded-xl shadow-lg">
          <div className="bg-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 hover">¿Listo para proteger tu propiedad?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nuestros especialistas están disponibles para responder todas tus consultas.
            </p>
            <a
              href="https://wa.me/5492984392148?text=Hola,%20me%20gustaría%20solicitar%20información%20sobre%20sus%20cercos%20perimetrales"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brandHover text-white font-bold py-3 px-8 rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              <FaWhatsapp className="w-5 h-5" /> {/* Icono de WhatsApp */}
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}