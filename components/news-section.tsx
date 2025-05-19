import Image from "next/image"
import { ArrowRight } from "lucide-react"

const newsItems = [
  {
    id: 1,
    title: "Nuevos materiales ecológicos",
    excerpt: "Descubre nuestra nueva línea de materiales sustentables para construcciones eco-friendly.",
    date: "10 Mayo, 2025",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    title: "Guía de construcción en seco",
    excerpt: "Aprende todo sobre las ventajas y el proceso de construcción en seco para tus proyectos.",
    date: "2 Mayo, 2025",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    title: "Promociones de temporada",
    excerpt: "Aprovecha nuestras ofertas especiales en materiales de construcción durante este mes.",
    date: "28 Abril, 2025",
    image: "/placeholder.svg?height=400&width=600",
  },
]

export default function NewsSection() {
  return (
    <section className="py-16 construction-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block bg-orange-600 text-white px-4 py-1 mb-4 rounded-md font-bold">NOVEDADES</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Novedades y Consejos</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mantente informado sobre las últimas tendencias en construcción y consejos útiles para tus proyectos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 bg-orange-600 text-white px-3 py-1 font-bold text-sm">
                  {item.date}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">{item.excerpt}</p>
                <button className="flex items-center text-orange-600 font-bold hover:text-orange-700 transition-colors group">
                  Leer más
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-800 p-6 md:p-8 rounded-lg shadow-md text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-orange-600 text-white px-4 py-1 mb-4 rounded-md font-bold">
                INFORMACIÓN ÚTIL
              </div>
              <h3 className="text-2xl font-bold mb-6">Para profesionales y particulares</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-orange-600 text-white rounded-md p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="font-medium">Asesoramiento personalizado para cada proyecto</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-600 text-white rounded-md p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="font-medium">Presupuestos sin cargo y financiación disponible</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-600 text-white rounded-md p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="font-medium">Garantía en todos nuestros productos</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-600 text-white rounded-md p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="font-medium">Descuentos especiales para constructores</span>
                </li>
              </ul>
            </div>
            <div className="relative h-64 w-full rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Información para compradores"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">¿Necesitas ayuda?</h4>
                  <p className="text-gray-200 mb-4">Nuestro equipo técnico está disponible para asesorarte</p>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                    Contactar ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
