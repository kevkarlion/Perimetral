import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Mail, Phone, MapPin, Clock, CreditCard, Truck, HardHat } from "lucide-react"

export default function Footer() {
  return (
    <footer>
      <div className="bg-gray-800 text-white py-12">
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
                  className="object-contain bg-white p-2 rounded-md"
                />
              </div>
              <p className="text-gray-400 mb-6">
                Más de 20 años brindando materiales de calidad para la construcción y el hogar.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="https://facebook.com"
                  className="bg-orange-600 p-2 rounded-full hover:bg-orange-700 transition-colors"
                >
                  <Facebook size={20} />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="https://instagram.com"
                  className="bg-orange-600 p-2 rounded-full hover:bg-orange-700 transition-colors"
                >
                  <Instagram size={20} />
                  <span className="sr-only">Instagram</span>
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">Contacto</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                  <span>Av. Siempreviva 742, Springfield</span>
                </li>
                <li className="flex items-start">
                  <Phone className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                  <span>+54 11 5555-5555</span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                  <span>info@corralon.com</span>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 text-orange-500 mr-3 mt-1 flex-shrink-0" />
                  <span>
                    Lun-Vie: 8:00 - 19:00
                    <br />
                    Sáb: 8:00 - 13:00
                  </span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">Enlaces Rápidos</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/productos"
                    className="text-gray-400 hover:text-orange-500 transition-colors flex items-center"
                  >
                    <span className="mr-2">›</span> Productos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nosotros"
                    className="text-gray-400 hover:text-orange-500 transition-colors flex items-center"
                  >
                    <span className="mr-2">›</span> Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    href="/servicios"
                    className="text-gray-400 hover:text-orange-500 transition-colors flex items-center"
                  >
                    <span className="mr-2">›</span> Servicios
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-400 hover:text-orange-500 transition-colors flex items-center"
                  >
                    <span className="mr-2">›</span> Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contacto"
                    className="text-gray-400 hover:text-orange-500 transition-colors flex items-center"
                  >
                    <span className="mr-2">›</span> Contacto
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2">Nuestros Servicios</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Truck className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                  <span>Entrega a domicilio</span>
                </li>
                <li className="flex items-center">
                  <HardHat className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                  <span>Asesoramiento técnico</span>
                </li>
                <li className="flex items-center">
                  <CreditCard className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                  <span>Financiación disponible</span>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="text-gray-400 hover:text-orange-500 transition-colors flex items-center mt-4"
                  >
                    <span className="mr-2">›</span> Preguntas Frecuentes
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center">
                    <span className="mr-2">›</span> Términos y Condiciones
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 py-4 text-center text-gray-400">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Corralón. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
