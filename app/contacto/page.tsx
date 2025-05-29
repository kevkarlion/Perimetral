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

      {/* Contenido Principal */}
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Formulario Minimalista */}
          <div>
            <h2 className="text-2xl font-bold text-[#1B1B1B] mb-8">Escríbenos</h2>
            <form className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  className="w-full px-4 py-3 border-b border-[#BFBFBF] focus:border-[#B99B76] outline-none bg-transparent"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 border-b border-[#BFBFBF] focus:border-[#B99B76] outline-none bg-transparent"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Teléfono"
                  className="w-full px-4 py-3 border-b border-[#BFBFBF] focus:border-[#B99B76] outline-none bg-transparent"
                />
              </div>
              <div>
                <textarea
                  placeholder="Mensaje"
                  rows={4}
                  className="w-full px-4 py-3 border-b border-[#BFBFBF] focus:border-[#B99B76] outline-none bg-transparent"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#1B1B1B] text-white hover:bg-[#B99B76] transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>

          {/* Información de Contacto */}
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
                  <p className="text-sm text-[#7A7A7A] group-hover:text-[#B99B76] transition-colors">
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
                  <p className="text-[#7A7A7A]">info@cercosneuquen.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <FaMapMarkerAlt className="text-[#7A7A7A]" />
                </div>
                <div>
                  <p className="font-medium text-[#1B1B1B]">Dirección</p>
                  <p className="text-[#7A7A7A]">Av. Industrial 1234, Neuquén</p>
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
      <div className="border-t border-gray-200 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl font-bold text-[#1B1B1B] mb-8 text-center">Nuestra ubicación</h2>
          <div className="aspect-video bg-gray-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3108.053943519541!2d-68.12345678901234!3d-38.98765432109876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzjCsDU5JzE1LjYiUyA2OMKwMDcnMTYuNiJX!5e0!3m2!1ses!2sar!4v1234567890123!5m2!1ses!2sar"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Ubicación en mapa"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}