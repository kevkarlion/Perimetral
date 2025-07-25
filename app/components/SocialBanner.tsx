import { FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

export default function SocialBanner() {
  return (
    <div className="bg-balckHero py-8 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold text-white mb-2">¡Conecta con nosotros!</h3>
          <p className="text-white/90">Síguenos para ofertas exclusivas</p>
        </div>

        <div className="flex gap-5">
          <a href="https://www.instagram.com/perimetralroca/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-300 transition-colors">
            <FaInstagram className="text-3xl" />
          </a>
          <a href="https://www.facebook.com/perimetralroca" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300 transition-colors">
            <FaFacebook className="text-3xl" />
          </a>
          <a href="https://wa.me/5492984392148" target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-300 transition-colors">
            <FaWhatsapp className="text-3xl" />
          </a>
        </div>
      </div>
    </div>
  )
}