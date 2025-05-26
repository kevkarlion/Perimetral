import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, ShieldCheck, Settings, Award, Star } from "lucide-react";

export default function ProductosSection() {
  const productos = [
    {
      id: 1,
      nombre: "Alambrado Perimetral Galvanizado",
      imagen: "alambrado-vedette/a1.webp",
      descripcion: "Ideal para cercos perimetrales en terrenos rurales, industriales o residenciales. Alta resistencia y durabilidad gracias a su recubrimiento galvanizado.",
      caracteristicas: [
        "Altura: 1.80mts x 10mts",
        "Diametro 63mm",
        "Vida útil: 15+ años"
      ],
      precio: "$80.000/m lineal + iva",
      destacado: true
    },
    {
      id: 2,
      nombre: "Portones Automatizados",
      imagen: "porton-automatico.webp",
      descripcion: "Sistemas de apertura automática con motores silenciosos",
      caracteristicas: [
        "Motores de 24V/500W",
        "Control remoto incluido",
        "Sensores de seguridad"
      ],
      precio: "$185.000",
      destacado: false
    },
    {
      id: 3,
      nombre: "Cerca Rompevistas",
      imagen: "rompevistas.webp",
      descripcion: "Paneles de privacidad con diseño moderno",
      caracteristicas: [
        "Materiales: madera sintética o PVC",
        "Resistente a rayos UV",
        "Mantenimiento mínimo"
      ],
      precio: "$6.800/m lineal",
      destacado: true
    },
    {
      id: 4,
      nombre: "Alambrados Olímpicos",
      imagen: "alambrado-olimpico.webp",
      descripcion: "Solución económica para grandes superficies",
      caracteristicas: [
        "Alambre de alta tensión",
        "Postes de quebracho o hormigón",
        "Instalación rápida"
      ],
      precio: "$2.900/m lineal",
      destacado: false
    },
    {
      id: 5,
      nombre: "Cercos Eléctricos",
      imagen: "cerco-electrico.webp",
      descripcion: "Sistema de disuasión para máxima seguridad",
      caracteristicas: [
        "Energizador de 9000V",
        "Aisladores cerámicos",
        "Bajo consumo"
      ],
      precio: "$9.500/m lineal",
      destacado: true
    },
    {
      id: 6,
      nombre: "Rejas Artísticas",
      imagen: "reja-artistica.webp",
      descripcion: "Diseños personalizados para propiedades exclusivas",
      caracteristicas: [
        "Acero corten o hierro forjado",
        "Tratamiento anticorrosivo",
        "Hecho a medida"
      ],
      precio: "Consultar",
      destacado: false
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary mb-4">
            <ShieldCheck className="h-4 w-4" />
            SEGURIDAD PERIMETRAL
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestros <span className="text-primary">Productos</span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Soluciones de calidad para cada necesidad de cerramiento y seguridad
          </p>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productos.map((producto) => (
            <div 
              key={producto.id}
              className={`relative group overflow-hidden rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 ${producto.destacado ? 'ring-2 ring-primary' : ''}`}
            >
              {/* Badge destacado */}
              {producto.destacado && (
                <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full z-10 flex items-center">
                  <Star className="h-3 w-3 mr-1" /> DESTACADO
                </div>
              )}
              
              {/* Imagen del producto */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={`/Productos/${producto.imagen}`}
                  alt={producto.nombre}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
              </div>
              
              {/* Contenido de la card */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{producto.nombre}</h3>
                <p className="text-gray-600 mb-4">{producto.descripcion}</p>
                
                {/* Características */}
                <ul className="space-y-2 mb-6">
                  {producto.caracteristicas.map((caracteristica, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <ChevronRight className="h-4 w-4 mt-1 mr-2 text-primary flex-shrink-0" />
                      <span>{caracteristica}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Precio y CTA */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="font-bold text-lg text-gray-900">{producto.precio}</span>
                  <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    <Link href={`/productos/${producto.id}`}>
                      Ver detalles <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA final */}
        <div className="text-center mt-16">
          <Button asChild className="bg-primary hover:bg-primary/90 text-white text-lg py-6 px-8">
            <Link href="/contacto">
              SOLICITAR CATÁLOGO COMPLETO
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}