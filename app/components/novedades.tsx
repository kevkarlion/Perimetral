'use client'
import Image from "next/image"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

const newsItems = [
  {
    id: 1,
    title: "Guía para Elegir el Cercado Perfecto para tu Propiedad",
    excerpt: "Factores clave a considerar antes de instalar tu cerco perimetral.",
    date: "10 Mayo, 2025",
    image: "/consejos/cerco1.webp",
  },
  {
    id: 2,
    title: "Alambrados de Alta Resistencia: ¿Cuál Elegir?",  
    excerpt: "Comparativa técnica entre mallas torsionadas, concertinas y alambres galvanizados.",  
    date: "15 Junio, 2025",
    image: "/panoramica-completo.webp",
  },
  {
    id: 3,
    title: "Instalación Profesional de Alambre de Púas",  
    excerpt: "Aprende a evitar fallos comunes y maximiza la durabilidad de tu cerco.",  
    date: "22 Junio, 2025",
    image: "/Productos/puas/pua3.webp",
  },
  // {
  //   id: 4,
  //   title: "Por Qué Usar Zapata en Instalaciones de Alambrado",
  //   excerpt: "Conocé el rol clave de la zapata en la durabilidad, estabilidad y seguridad de cercos de alta resistencia.",
  //   date: "15 Junio, 2025",
  //   image: "/Productos/zapata/zapata-cemento.webp",
  //   category: "Instalación Profesional"
  // }
]

export default function NewsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)
  const [isAnimating, setIsAnimating] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const totalItems = newsItems.length

  // Ajustar items visibles según el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
      // Asegurar que el índice actual sea válido después del resize
      setCurrentIndex(prev => Math.min(prev, totalItems - itemsPerView))
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [totalItems, itemsPerView])

  const handleSwipe = () => {
    const distance = touchStartX.current - touchEndX.current
    if (distance > 50) nextSlide() // Swipe izquierda
    if (distance < -50) prevSlide() // Swipe derecha
  }

  const nextSlide = () => {
    if (isAnimating || currentIndex >= totalItems - itemsPerView) return
    setIsAnimating(true)
    setCurrentIndex(prev => Math.min(prev + 1, totalItems - itemsPerView))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating || currentIndex <= 0) return
    setIsAnimating(true)
    setCurrentIndex(prev => Math.max(prev - 1, 0))
    setTimeout(() => setIsAnimating(false), 500)
  }

  // Calcular qué items mostrar
  const visibleItems = newsItems.slice(currentIndex, currentIndex + itemsPerView)

  return (
    <section className="py-16 construction-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="inline-block bg-brand text-white px-4 py-1 mb-4 rounded-md font-bold">NOVEDADES</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿No sabés qué cerco elegir?</h2>
          <p className="max-w-[700px] pb-8 font-bold text-center text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Leé nuestras guías y consejos profesionales
          </p>
        </div>

        {/* Contenedor del carrusel */}
        <div className="relative group">
          {/* Flechas de navegación */}
          <button 
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all ${
              currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
            }`}
            aria-label="Noticia anterior"
          >
            <ChevronLeft size={28} strokeWidth={2} />
          </button>

          <button 
            onClick={nextSlide}
            disabled={currentIndex >= totalItems - itemsPerView}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all ${
              currentIndex >= totalItems - itemsPerView ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
            }`}
            aria-label="Siguiente noticia"
          >
            <ChevronRight size={28} strokeWidth={2} />
          </button>

          {/* Tarjetas de noticias con animación */}
          <div 
            className="relative overflow-hidden"
            onTouchStart={(e) => touchStartX.current = e.touches[0].clientX}
            onTouchEnd={(e) => {
              touchEndX.current = e.changedTouches[0].clientX
              handleSwipe()
            }}
          >
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: itemsPerView === 1 ? 50 : 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: itemsPerView === 1 ? -50 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`grid grid-cols-1 ${itemsPerView >= 2 ? 'sm:grid-cols-2' : ''} ${itemsPerView >= 3 ? 'lg:grid-cols-3' : ''} gap-8`}
            >
              {visibleItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden group"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute bottom-0 left-0 bg-yellowOne text-blackDeep px-3 py-1 font-bold text-sm">
                      {item.date}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-5">{item.excerpt}</p>
                    <Link 
                      href={`/news/${item.id}`}
                      className="inline-flex items-center text-brand font-bold hover:text-brandHover transition-colors group"
                    >
                      Leer más
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Indicadores de posición */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.max(1, totalItems - itemsPerView + 1) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-brand w-6' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir a la noticia ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Sección de información útil */}
        <div className="mt-16 bg-gray-800 p-6 md:p-8 rounded-xl shadow-lg text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-brand text-white px-4 py-1 mb-6 rounded-md font-bold text-sm uppercase tracking-wide">
                Información útil
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
                Soluciones profesionales para tu proyecto
              </h3>
              
              <ul className="space-y-4">
                {[
                  "Asesoramiento técnico personalizado",
                  "Presupuestos sin cargo",
                  "Garantía extendida en materiales",
                  "Instalación profesional"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-brand/90 text-white rounded-full p-1.5 mr-3 mt-0.5 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="font-medium text-gray-100">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden">
              <div className="hidden md:flex absolute inset-0">
                <div className="flex-1 relative border-r border-gray-600">
                  <Image
                    src="/Productos/novedades-rectangulo.webp"
                    alt="Instalación profesional"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 relative border-r border-gray-600">
                  <Image
                    src="/Productos/blanco-y-negro-perimetral.webp"
                    alt="Materiales de calidad"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 relative">
                  <Image
                    src="/Productos/novedades-rect1.webp"
                    alt="Proyecto terminado"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="md:hidden absolute inset-0">
                <Image
                  src="/Productos/novedades-rectangulo.webp"
                  alt="Soluciones en cercos perimetrales"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/30 to-transparent flex flex-col justify-end p-6">
                <h4 className="text-xl font-bold text-white mb-2">¿Necesitas asesoramiento?</h4>
                <p className="text-gray-200 mb-5">Expertos en seguridad perimetral</p>
                <a
                  href="https://wa.me/5492984392148"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-brand hover:bg-brandHover text-white font-bold py-3 px-6 rounded-lg transition-colors w-max"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contactar ahora
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}