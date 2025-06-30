import { FaWhatsapp, FaPhoneAlt, FaMapMarkerAlt, FaClock, FaEnvelope } from 'react-icons/fa'

export default function ContactoPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section Minimalista */}
      <section className="border-b border-gray-200 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1B1B1B] mb-4">Contacto</h1>
          <p className="text-xl text-[#7A7A7A] max-w-2xl mx-auto">
            Simple y directo, como nos gusta trabajar
          </p>
        </div>
      </section>

      {/* Información de Contacto */}
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="grid md:grid-cols-1 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-[#1B1B1B] mb-8">Cómo encontrarnos</h2>

            {/* WhatsApp Directo */}
            <div className="mb-10">
              <a
                href="https://wa.me/5492984392148"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="bg-blackCharcoal p-3 rounded-full text-white">
                  <FaWhatsapp className="text-lg" />
                </div>
                <div>
                  <p className="font-medium text-[#1B1B1B]">Chat directo</p>
                  <p className="text-sm text-[#7A7A7A] group-hover:text-brandHover transition-colors">
                    Respuesta inmediata
                  </p>
                </div>
              </a>
            </div>

            {/* Lista de Contactos */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <FaPhoneAlt className="text-[#7A7A7A]" />
                </div>
                <div>
                  <p className="font-medium text-[#1B1B1B]">Teléfono</p>
                  <p className="text-[#7A7A7A]">298 439-2148</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <FaEnvelope className="text-[#7A7A7A]" />
                </div>
                <div>
                  <p className="font-medium text-[#1B1B1B]">Email</p>
                  <p className="text-[#7A7A7A]">perimetral.info@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <FaMapMarkerAlt className="text-[#7A7A7A]" />
                </div>
                <div>
                  <p className="font-medium text-[#1B1B1B]">Dirección</p>
                  <p className="text-[#7A7A7A]">Cacique Catriel 850, Stefenelli, General Roca, Río Negro</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <FaClock className="text-[#7A7A7A]" />
                </div>
                <div>
                  <p className="font-medium text-[#1B1B1B]">Horarios</p>
                  <p className="text-[#7A7A7A]">Lun-Vie: 8:00 - 18:00</p>
                  <p className="text-[#7A7A7A]">Sáb: 9:00 - 13:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa Minimalista */}
      <div className="border-t border-gray-200 py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B1B1B] mb-4">Visítanos en nuestro local</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Estamos ubicados en <strong>Logística Vaquer</strong> para atender tus proyectos de cercos perimetrales
            </p>
          </div>

          <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-xl border border-gray-200">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d774.6539922364223!2d-67.50543493463768!3d-39.04687463977054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x960a032b5bffa04f%3A0x7b7d042362bdc26f!2sLog%C3%ADstica%20Vaquer!5e0!3m2!1ses!2sar!4v1750163327496!5m2!1ses!2sar" 
              width="100%" 
              height="450" 
              className="w-full h-[450px] md:h-[500px]" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              aria-label="Mapa de ubicación de nuestra empresa"
              title="Ubicación de nuestra empresa en Logística Vaquer"
            ></iframe>
          </div>

          <div className="mt-8 text-center">
            <a 
              href="https://maps.google.com/?q=Logística+Vaquer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-brand hover:text-brand-dark font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              Abrir en Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
