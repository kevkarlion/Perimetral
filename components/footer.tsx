import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Mail, Phone, MapPin, Clock } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="mb-6">
                <Image
                  src="/placeholder.svg?height=48&width=160"
                  alt="Corralón Logo"
                  width={160}
                  height={48}
                  className="object-contain bg-brand p-2 rounded-md"
                />
              </div>
              <p className="text-gray-400 mb-6">
                Más de 20 años brindando materiales de calidad para la construcción y el hogar.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-brand pb-2">Navegación</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-brand transition-colors flex items-center"
                  >
                    <span className="mr-2">›</span> Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalogo"
                    className="text-gray-400 hover:text-brand transition-colors flex items-center"
                  >
                    <span className="mr-2">›</span> Catálogo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nosotros"
                    className="text-gray-400 hover:text-brand transition-colors flex items-center"
                  >
                    <span className="mr-2">›</span> Nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    href="/novedades"
                    className="text-gray-400 hover:text-brand transition-colors flex items-center"
                  >
                    <span className="mr-2">›</span> Novedades y consejos
                  </Link>
                </li>
              
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-brand pb-2">Contacto</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-brand mr-3 mt-1 flex-shrink-0" />
                  <span>Av. Siempreviva 742, General Roca, Río Negro</span>
                </li>
                <li className="flex items-start">
                  <Phone className="h-5 w-5 text-brand mr-3 mt-1 flex-shrink-0" />
                  <span>+54 298 - 4392148</span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-5 w-5 text-brand mr-3 mt-1 flex-shrink-0" />
                  <span>info@corralon.com</span>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-brand mr-3 mt-1 flex-shrink-0" />
                  <span>
                    Lun-Vie: 8:00 - 19:00
                    <br />
                    Sáb: 8:00 - 13:00
                  </span>
                </li>
              </ul>
            </div>

            {/* Redes Sociales */}
            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-brand pb-2">Nuestras Redes</h3>
              <div className="space-y-4">
                <a
                  href="https://www.facebook.com/perimetralroca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-brand transition-colors"
                >
                  <div className="bg-brand text-black p-2 rounded-full mr-3">
                    <Facebook size={18} />
                  </div>
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.instagram.com/perimetralroca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-brand transition-colors"
                >
                  <div className="bg-brand text-black p-2 rounded-full mr-3">
                    <Instagram size={18} />
                  </div>
                  <span>Instagram</span>
                </a>
                <a
                  href="https://wa.me/542984392148"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-brand transition-colors"
                >
                  <div className="bg-brand text-black p-2 rounded-full mr-3">
                    <FaWhatsapp size={18} />
                  </div>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 py-4 text-center text-gray-400">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} PERIMETRAL. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}