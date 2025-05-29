import Image from 'next/image';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';

export default function NosotrosPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] w-full">
        <Image
          src="/campo-nosotros.jpg"
          alt="Fábrica de cercos perimetrales en Neuquén"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Expertos en Seguridad Perimetral desde 2003
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
            En <strong>PERIMETRAL</strong> nos especializamos en la fabricación e instalación 
            de sistemas de protección perimetral de alta calidad. Con más de 20 años de experiencia 
            en el mercado, hemos protegido cientos de hogares y empresas en toda la Patagonia.
          </p>
          
          <p>
            Nuestra fábrica, ubicada estratégicamente en Neuquén, cuenta con tecnología de última 
            generación para garantizar productos duraderos y resistentes a las condiciones climáticas 
            más exigentes. Todos nuestros materiales pasan por rigurosos controles de calidad.
          </p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
            ¿Por qué elegirnos?
          </h3>
          
          <ul className="space-y-3">
            <li>Fabricación propia con estándares internacionales</li>
            <li>Instalación profesional por equipos certificados</li>
            <li>Materiales galvanizados de alta resistencia</li>
            <li>Asesoramiento técnico personalizado</li>
            <li>Garantía escrita en todos nuestros productos</li>
          </ul>
        </div>

        {/* CTA y Redes Sociales */}
        <div className="mt-16 text-center bg-gray-50 p-8 rounded-xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            ¿Listo para proteger tu propiedad?
          </h3>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <a
              href="https://wa.me/5492984392148?text=Hola,%20me%20interesa%20cotizar%20un%20cerco%20perimetral"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg inline-flex items-center justify-center gap-2 transition-colors"
            >
              <FaWhatsapp className="h-5 w-5" />
              Contactar por WhatsApp
            </a>
          </div>
          
          <div className="flex justify-center gap-6">
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
              <FaFacebook className="h-6 w-6" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-pink-600 transition-colors">
              <FaInstagram className="h-6 w-6" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}