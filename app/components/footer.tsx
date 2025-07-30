import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Mail, Phone, MapPin, Clock } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo y Descripción */}
          <div className="space-y-4">
            <div className="w-32">
              <Image
                src="/Logos/Logo-mobile.webp"
                alt="Corralón Logo"
                width={160}
                height={48}
                className="w-full h-auto"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Especialistas en materiales de alta calidad para construcción y seguridad perimetral.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white">Navegación</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Inicio" },
                { href: "/catalogo", label: "Catálogo" },
                { href: "/nosotros", label: "Nosotros" },
                { href: "/news", label: "Novedades" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-brand text-sm transition-colors flex items-center">
                    <span className="mr-1">›</span> {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 text-brand mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">Cacique Catriel 850, Stefenelli, Roca</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 text-brand mr-2 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+54 298 - 4392148</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 text-brand mr-2 flex-shrink-0" />
                <span className="text-gray-400 text-sm">perimetral.info@gmail.com</span>
              </li>
              <li className="flex items-start">
                <Clock className="h-4 w-4 text-brand mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Lun-Vie: 8:00 - 19:00<br />
                  Sáb: 8:00 - 13:00
                </span>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white">Redes Sociales</h3>
            <div className="space-y-3">
              {[
                { icon: <Facebook size={16} />, href: "https://www.facebook.com/perimetralroca", label: "Facebook" },
                { icon: <Instagram size={16} />, href: "https://www.instagram.com/perimetralroca/", label: "Instagram" },
                { icon: <FaWhatsapp size={16} />, href: "https://wa.me/542984392148", label: "WhatsApp" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-400 hover:text-brand transition-colors text-sm"
                >
                  <div className="bg-brand text-black p-1.5 rounded-full mr-3">
                    {social.icon}
                  </div>
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-6"></div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} PERIMETRAL. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}