import Link from 'next/link';
import Image from 'next/image';
import { Star, Check, ArrowRight } from 'lucide-react';
import { productos } from '@/data/products';

export default function ProductosPage() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Encabezado mejorado */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Catálogo de Productos</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          Soluciones profesionales para cerramientos y seguridad perimetral
        </p>
      </div>

      {/* Filtros (opcional) */}
      {/* <div className="flex flex-wrap justify-center gap-3 mb-12">
        <button className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
          Todos
        </button>
        <button className="px-5 py-2.5 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
          Alambrados
        </button>
        <button className="px-5 py-2.5 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
          Accesorios
        </button>
        <button className="px-5 py-2.5 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
          Ofertas
        </button>
      </div> */}

      {/* Grid de productos ampliado */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {productos.map((producto) => (
          <div 
            key={producto.id}
            className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20 bg-white"
          >
            {/* Imagen con badge destacado - Más grande */}
            <div className="relative h-80">
              <Link href={`/catalogo/${producto.id}`} className="block h-full">
                <Image
                  src={producto.src}
                  alt={producto.nombre}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </Link>
              {producto.destacado && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center shadow-md">
                  <Star className="h-4 w-4 mr-1.5" /> DESTACADO
                </div>
              )}
            </div>

            {/* Contenido de la card - Más espaciado */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <Link href={`/productos/${producto.id}`} className="group">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {producto.nombre}
                  </h2>
                </Link>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full font-medium whitespace-nowrap ml-3">
                  {producto.categoria}
                </span>
              </div>

              <p className="text-gray-600 text-base mb-5 line-clamp-3">
                {producto.descripcionCorta}
              </p>

              {/* Especificaciones principales - Más visibles */}
              <ul className="space-y-2.5 mb-6">
                {producto.especificaciones?.slice(0, 3).map((espec, index) => (
                  <li key={index} className="flex items-start text-base">
                    <Check className="h-5 w-5 text-green-500 mr-2.5 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{espec}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-end justify-between mt-6 pt-6 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Precio desde</p>
                  <p className="text-2xl font-bold text-primary">
                    {producto.precio}
                  </p>
                </div>
                <Link 
                  href={`/catalogo/${producto.id}`}
                  className="flex items-center text-base font-medium text-primary hover:text-primary/80 transition-colors group"
                >
                  Ver detalles
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA al final - Más destacado */}
      <div className="text-center mt-20">
        <div className="bg-gray-50 rounded-2xl p-8 md:p-10 inline-block max-w-4xl">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-5">
            ¿No encuentras lo que necesitas?
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Nuestros asesores pueden ayudarte a encontrar la solución perfecta para tu proyecto
          </p>
          <Link
            href="/contacto"
            className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-4 px-8 rounded-lg transition-colors text-lg shadow-md hover:shadow-lg"
          >
            Contactar a un asesor
          </Link>
        </div>
      </div>
    </div>
  );
}