'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/app/components/ui/button'
import { Truck, HardHat, ChevronLeft, ChevronRight } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { AnimatePresence, motion } from 'framer-motion'
import { useSwipeable } from 'react-swipeable'

// ✅ IMPORT ESTÁTICO DE IMÁGENES
import cerco1 from '@/public/cerco1.webp'
import cerco2 from '@/public/cerco2.webp'
import cerco10 from '@/public/cerco10.webp'

// ✅ Array de imágenes como objetos
const images = [cerco1, cerco10, cerco2]

export default function HeroCarousel() {
  const [[index, direction], setIndex] = useState([0, 0])

  const paginate = useCallback((newDirection: number) => {
    setIndex(([prevIndex]) => {
      const nextIndex = (prevIndex + newDirection + images.length) % images.length
      return [nextIndex, newDirection]
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => paginate(1), 5000)
    return () => clearInterval(interval)
  }, [paginate])

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => paginate(1),
    onSwipedRight: () => paginate(-1),
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: false,
  })

  return (
    <section
      className="relative h-[80vh] md:h-[60vh] md:min-h-[600px] min-h-[750px] w-full overflow-hidden border-b-8 border-brand "
      {...swipeHandlers}
    >
      {/* Carousel Images */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          className="absolute inset-0 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src={images[index]}
            alt={`Slide ${index + 1}`}
            fill
            className="object-cover brightness-75"
            priority={index === 0}
            placeholder="blur" // ✅ Esto ahora sí funciona
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={() => paginate(-1)}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-[99] bg-black/30 hover:bg-black/50 p-3 rounded-full text-white transition"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => paginate(1)}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-[99] bg-black/30 hover:bg-black/50 p-3 rounded-full text-white transition"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Content */}
      <div className="relative top-3 h-full container mx-auto px-4 flex flex-col justify-center items-start z-[50]">
        <div className="max-w-2xl text-white">
          <div className="text-center lg:text-left inline-block bg-brand uppercase tracking-tighter text-blackCharcoal px-4 py-1 mb-4 rounded-md font-bold">
            Fabricamos e instalamos cercos perimetrales
          </div>
          <h1 className="text-center lg:text-left text-4xl md:text-5xl lg:text-5xl font-bold tracking-tighter mb-4 leading-tight">
            Cercos <br /> Perimetrales a Medida <br /> Instalación Profesional
          </h1>
          <h2 className="text-lg md:text-xl mb-8 text-gray-200 tracking-tighter">
            <span className="text-center lg:text-left block text-brand mt-2 tracking-tighter">
              Protección y Seguridad <br /> Cercos de Alta Calidad{' '}
              <span className="text-white">para Empresas y Hogares</span>
            </span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-blackCharcoal hover:bg-blackDeep text-white font-bold">
              <Link href="/catalogo" className="flex items-center gap-2">
                Explorar cercos
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-blackCharcoal border-white hover:bg-white/10 font-bold"
              asChild
            >
              <a
                href="https://wa.me/5492984392148?text=Hola,%20me%20interesa%20solicitar%20un%20presupuesto%20de%20cercos%20perimetrales"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <FaWhatsapp className="h-5 w-5 text-green-500" />
                Solicitar Presupuesto
              </a>
            </Button>
          </div>

          {/* Quick Contact */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 flex-wrap pb-16 sm:pb-0">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Truck className="h-5 w-5 text-brand" />
              </div>
              <span className="text-sm">Envíos Gratis - Alto Valle y Neuquén</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <HardHat className="h-5 w-5 text-brand" />
              </div>
              <span className="text-sm">Asesoramiento técnico</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-[98]">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex([i, i > index ? 1 : -1])}
            className={`w-3 h-3 rounded-full transition ${
              i === index ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`Ir al slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
