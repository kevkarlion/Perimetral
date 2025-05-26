// components/WhatsAppCTA.tsx
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppCTA() {
  const phoneNumber = "5492984392148"; // Reemplaza con tu número
  const message = "Hola, estoy interesado en cercos perimetrales. ¿Me pueden asesorar?";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-16 h-16 md:w-18 md:h-18 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 group"
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsapp className="text-white text-3xl md:text-4xl" />
        
        {/* Efecto de pulso opcional */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-0 group-hover:opacity-40 group-hover:scale-125 transition-all duration-500"></span>
      </Link>

      {/* Tooltip en hover (opcional para desktop) */}
      <div className="hidden md:block absolute right-20 bottom-4 bg-gray-800 text-white text-sm px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        ¡Cotización inmediata!
      </div>
    </div>
  );
}