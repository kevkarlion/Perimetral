"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ShoppingCart, User, Truck, HardHat, Phone, MapPin, Home, Box, Info, PhoneCall } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectamos si es móvil al montar el componente y al cambiar tamaño
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile() // Verificación inicial
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Efecto para detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cierra el menú al cambiar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Links del navbar (centralizado para fácil mantenimiento)
  const navLinks = [
    { href: "/", label: "Inicio", icon: <Home size={18} /> , id: '#inicio'},
    { href: "/catalogo", label: "Catálogo", icon: <Box size={18} /> , id: '#products'},
    { href: "/nosotros", label: "Nosotros", icon: <Info size={18} /> , id: '#nosotros'},
    { href: "/contacto", label: "Contacto", icon: <PhoneCall size={18} /> , id: '#contact'},
  ]

  return (
    <header className={`sticky top-0 z-[100] bg-balckHero transition-shadow ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      {/* Barra superior informativa */}
      <div className="bg-brand text-white py-1 px-4 text-xs sm:text-sm">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone size={14} className="mr-1" />
              <span>298 - 4392148</span>
            </div>
            <div className="hidden sm:flex items-center">
              <MapPin size={14} className="mr-1" />
              <span>General Roca - Cipolletti, Río Negro / Neuquén</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link href="/seguimiento" className="hover:underline flex items-center">
              <Truck size={14} className="mr-1" />
              <span className="hidden xs:inline">Envíos Gratis - Alto Valle y Neuquén</span>
              <span className="xs:hidden">Envíos Gratis - Alto Valle y Neuquén</span>
            </Link>
            <Link href="/presupuesto" className="hover:underline flex items-center">
              <HardHat size={14} className="mr-1" />
              <span>Presupuesto</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navbar principal */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
            <div className="relative h-16 w-32 md:h-20 md:w-52">
                {isMobile ? (
                  <Image
                    src="/Logos/Logo-mobile.png" // Ruta de tu logo para móvil
                    alt="Corralón Perimetral - Versión móvil"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 128px, 192px"
                  />
                ) : (
                  <Image
                    src="/Logos/logo-header-black.svg" // Ruta de tu logo para desktop
                    alt="Corralón Perimetral - Versión completa"
                    fill
                    className="object-contain"
                    priority
                    sizes="(max-width: 768px) 128px, 192px"
                  />
                )}
              </div>
            </Link>
          </div>

          {/* Menú desktop */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 ml-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                id={link.id}
                className="relative px-3  py-2 text-white font-medium transition-colors group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 h-0.5 bg-white w-0 transition-all duration-300 group-hover:w-4/5 group-hover:left-[10%]" />
              </Link>
            ))}
          </nav>

          {/* Iconos de acción */}
          <div className="hidden md:flex items-center space-x-4 ml-6">
            <button className="p-2 text-white transition-colors relative">
              <ShoppingCart size={22} />
              <span className="absolute -top-1 -right-1 border-2 bg-blackDeep text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* Botón menú móvil */}
          <button
            className="md:hidden p-2 text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menú"
          >
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`absolute top-0 left-0 h-full w-80 max-w-[90%] bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Encabezado del menú móvil */}
          <div className="flex justify-between items-center p-4 bg-balckHero text-white">
            <div className="font-bold text-lg">MENÚ</div>
            <button
              className="p-2 text-white hover:text-yellow-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <X size={24} />
            </button>
          </div>

          {/* Contenido del menú móvil */}
          <nav className="p-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center space-x-3 py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-blackHero">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}

              <div className="border-t border-gray-200 pt-4 mt-2">
                <button className="flex items-center space-x-3 py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg transition-colors w-full">
                  <span className="text-blackHero">
                    <User size={18} />
                  </span>
                  <span className="font-medium">Mi cuenta</span>
                </button>

                <button className="flex items-center space-x-3 py-3 px-4 text-gray-800 hover:bg-gray-50 rounded-lg transition-colors w-full relative">
                  <span className="text-blackHero">
                    <ShoppingCart size={18} />
                  </span>
                  <span className="font-medium">Carrito</span>
                  <span className="absolute right-4 top-3 bg-balckHero text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}