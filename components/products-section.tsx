import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

export default function ProductosSection() {
  const productos = [
    {
      id: 1,
      nombre: "Alambrado Perimetral Galvanizado 1.80mts. x 10 mts.",
      
      imagen: "alambrado-principal.webp",
      precio: "$80.000/m lineal + iva",
      destacado: true
    },
    {
      id: 2,
      nombre: "Alambre de puas",
      detalle: "1.80mts x 10 mts",
      imagen: "alambrePuas.webp",
      precio: "$185.000",
      destacado: false
    },
    {
      id: 3,
      nombre: "Alambre de alta resistencia",
      detalle: "1.80mts x 10 mts",
      imagen: "rompevistas.webp",
      precio: "$6.800/m lineal",
      destacado: true
    },
    {
      id: 4,
      nombre: "Alambrados a medida",
      detalle: "1.80mts x 10 mts",
      imagen: "alambrado-olimpico.webp",
      precio: "$2.900/m lineal",
      destacado: false
    },
    {
      id: 5,
      nombre: "Postes para cerco",
      detalle: "1.80mts x 10 mts",
      imagen: "cerco-electrico.webp",
      precio: "$9.500/m lineal",
      destacado: true
    },
    {
      id: 6,
      nombre: "Accesorios para alambrados",
      detalle: "1.80mts x 10 mts",
      imagen: "reja-artistica.webp",
      precio: "Consultar",
      destacado: false
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Nuestros <span className="text-primary">Productos</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Soluciones de calidad para cada necesidad de cerramiento y seguridad
          </p>
        </div>

        {/* Grid de productos alargados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {productos.map((producto) => (
            <Link 
              key={producto.id}
              href={`/productos/${producto.id}`}
              className={`group relative flex flex-col h-full border border-gray-200 hover:border-primary rounded-lg overflow-hidden transition-all duration-300 ${
                producto.destacado ? 'ring-1 ring-primary' : ''
              }`}
            >
              {/* Badge destacado */}
              {producto.destacado && (
                <div className="absolute top-3 right-3 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full z-10 flex items-center">
                  <Star className="h-3 w-3 mr-1" /> DESTACADO
                </div>
              )}
              
              {/* Imagen del producto - Más alargada */}
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={`/Productos/${producto.imagen}`}
                  alt={producto.nombre}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              
              {/* Contenido */}
              <div className="p-4 flex-grow flex flex-col">
                <h3 className="text-sm font-light text-gray-900 group-hover:text-primary transition-colors">
                  {producto.nombre}
                </h3><p className="mt-1 font-medium text-gray-900">
                  {producto.detalle}
                </p>
                <p className="text-lg mt-1 font-bold text-gray-900">
                  {producto.precio}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-sm text-primary font-medium">
                  Ver detalles
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA final */}
         <div className="text-center mt-12">
          <Button asChild className="bg-primary hover:bg-primary/90 text-white py-5 px-7 text-base">
            <Link href="/contacto">
              SOLICITAR CATÁLOGO COMPLETO
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}