'use client'

import Image from 'next/image'
import { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Truck, HardHat, Phone, ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSwipeable } from 'react-swipeable'

const images = [
  '/cerco1.webp',
  '/cerco10.webp',
  '/cerco2.webp',
]

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
      className="relative h-[70vh] min-h-[500px] w-full overflow-hidden"
      {...swipeHandlers}
    >
      {/* Carousel Images */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          className="absolute inset-0"
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
            priority
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
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-start z-[50]">
        <div className="max-w-xl text-white pt-8 pb-8">
          <div className="inline-block bg-yellowOne text-blackCharcoal px-4 py-1 mb-4 rounded-md font-bold">
            CERCOS DE SEGURIDAD
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-4 leading-tight">
            Cercos Perimetrales a Medida - Instalación Profesional
          </h1>
          <h2 className="text-lg md:text-xl mb-8 text-gray-200">
            <span className="block text-yellowOne mt-2">
              Protección y Seguridad con Cercos de Alta Calidad
            </span>{' '}
            para Empresas y Hogares 
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-blackCharcoal hover:bg-blackDeep text-white font-bold">
              Ver Productos
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-blackCharcoal border-white hover:bg-white/10 font-bold"
            >
              Solicitar Presupuesto
            </Button>
          </div>

          {/* Quick Contact */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 flex-wrap pb-16 sm:pb-0">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Truck className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm">Envíos Gratis - Alto Valle y Neuquén</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <HardHat className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm">Asesoramiento técnico</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Phone className="h-5 w-5 text-yellow-400" />
              </div>
              <span className="text-sm text-left whitespace-nowrap">298 - 4392148</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicators - Moved outside content div and adjusted position */}
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