import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const newsItems = [
  {
    id: 1,
    title: "Guía para Elegir el Cercado Perfecto para tu Propiedad",
    excerpt: "Factores clave a considerar antes de instalar tu cerco perimetral.",
    date: "10 Mayo, 2025",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    title: "Alambrados de Alta Resistencia: ¿Cuál Elegir para tu Proyecto?",  
    excerpt: "Comparativa técnica entre mallas torsionadas, concertinas y alambres galvanizados para máxima seguridad.",  
    date: "15 Junio, 2025",
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    title: "Instalación Profesional de Alambre de Púas: Errores y Soluciones",  
    excerpt: "Aprende a evitar fallos comunes y maximiza la durabilidad de tu cerco perimetral con estos tips expertos.",  
    date: "22 Junio, 2025",
    image: "/placeholder.svg?height=400&width=600",
  },
]

export default function NewsSection() {
  return (
    <section className="py-16 construction-pattern">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="inline-block bg-brand text-white px-4 py-1 mb-4 rounded-md font-bold">NOVEDADES</div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿No sabés qué cerco elegir?</h2>
          <p className="max-w-[700px] pb-8 font-bold  text-center text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Leé nuestras guías y consejos.
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
                <div className="absolute bottom-0 left-0 bg-yellowOne text-blackDeep px-3 py-1 font-bold text-sm">
                  {item.date}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">{item.excerpt}</p>
                <Link 
                  href={`/news/${item.id}`}
                  className="flex items-center text-brand font-bold hover:text-brandHover transition-colors group"
                >
                  Leer más
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-800 p-6 md:p-8 rounded-lg shadow-md text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-brand text-white px-4 py-1 mb-4 rounded-md font-bold">
                INFORMACIÓN ÚTIL
              </div>
              <h3 className="text-2xl font-bold mb-6">Para profesionales y particulares</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-brand text-white rounded-md p-1 mr-3 mt-1">
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
                  <span className="bg-brand text-white rounded-md p-1 mr-3 mt-1">
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
                  <span className="bg-brand text-white rounded-md p-1 mr-3 mt-1">
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
                  <span className="bg-brand text-white rounded-md p-1 mr-3 mt-1">
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
                  <button className="bg-brand hover:bg-brandHover text-white font-bold py-2 px-4 rounded-md transition-colors">
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
