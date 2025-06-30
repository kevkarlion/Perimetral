'use client';
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

// Datos simulados
const newsItems = [
  {
    id: 1,
    title: "Guía para Elegir el Cercado Perfecto para tu Propiedad",
    excerpt: "Factores clave a considerar antes de instalar tu cerco perimetral. Aprende sobre materiales, resistencia y diseño para tu necesidad específica.",
    date: "10 Mayo, 2025",
    image: "/consejos/cerco1.webp",
    category: "Consejos Técnicos"
  },
  {
    id: 2,
    title: "Alambrados de Alta Resistencia: ¿Cuál Elegir?",  
    excerpt: "Comparativa técnica entre mallas torsionadas, concertinas y alambres galvanizados.",  
    date: "15 Junio, 2025",
    image: "/panoramica-completo.webp",
    category: "Comparativas Técnicas"
  },
   {
    id: 3,
    title: "Instalación Profesional de Alambre de Púas",  
    excerpt: "Aprende a evitar fallos comunes y maximiza la durabilidad de tu cerco.",  
    date: "22 Junio, 2025",
    image: "/Productos/puas/alambre-instalado.webp",
    category: "Seguridad y Protección"
  },
//  {
//     id: 4,
//     title: "Por Qué Usar Zapata en Instalaciones de Alambrado",
//     excerpt: "Conocé el rol clave de la zapata en la durabilidad, estabilidad y seguridad de cercos de alta resistencia.",
//     date: "15 Junio, 2025",
//     image: "/Productos/zapata/zapata-cemento.webp",
//     category: "Instalación Profesional"
//   }
];

export default function NewsMagazinePage() {
  const whatsappNumber = "5491112345678"; // Reemplaza con tu número
  const whatsappMessage = "Hola, vi su sección de novedades y me gustaría obtener más información";

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="border-b border-gray-200 pb-8 mb-12">
          <span className="block text-brand font-bold uppercase tracking-wider mb-2">Novedades</span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight max-w-4xl">
            Lo último en tecnología y diseño <br className="hidden md:block"/> para cercos perimetrales
          </h1>
        </div>

        {/* Artículo destacado (full width) */}
        <div className="mb-20">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <div className="lg:w-2/3 relative h-96 lg:h-[480px]">
              <Image
                src={newsItems[0].image}
                alt={newsItems[0].title}
                fill
                className="object-cover"
                priority
              />
              <span className="absolute top-4 left-4 bg-white text-brand px-3 py-1 rounded-full text-sm font-bold">
                {newsItems[0].category}
              </span>
            </div>
            <div className="lg:w-1/3 flex flex-col justify-center">
              <div className="flex items-center text-gray-500 mb-4">
                <CalendarDays size={16} className="mr-2" />
                <span className="text-sm">{newsItems[0].date}</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {newsItems[0].title}
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                {newsItems[0].excerpt}
              </p>
              <Link
                href={`/news/${newsItems[0].id}`}
                className="inline-flex items-center text-brand font-bold hover:text-brandHover transition-colors text-lg"
              >
                Leer artículo completo <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Sección de artículos secundarios */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-2">
            Más artículos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {newsItems.slice(1).map((item) => (
              <article key={item.id} className="flex flex-col md:flex-row gap-6 group">
                <div className="md:w-2/5 relative h-48 md:h-64">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="md:w-3/5">
                  <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                    {item.category}
                  </span>
                  <div className="flex items-center text-gray-500 mb-2">
                    <CalendarDays size={14} className="mr-2" />
                    <span className="text-xs">{item.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {item.excerpt}
                  </p>
                  <Link
                    href={`/news/${item.id}`}
                    className="inline-flex items-center text-brand font-bold hover:text-brandHover transition-colors text-sm"
                  >
                    Leer más <ArrowRight size={14} className="ml-2" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
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
      </div>
    </section>
  );
}