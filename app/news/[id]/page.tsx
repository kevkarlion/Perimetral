'use client';
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';

// Datos simulados (reemplaza con tu fuente real: API, CMS, etc.)
const newsItems = [
  {
    id: 1,
    title: "Guía para Elegir el Cercado Perfecto para tu Propiedad",
    excerpt: "Factores clave a considerar antes de instalar tu cerco perimetral.",
    date: "10 Mayo, 2025",
    image: "/consejos/cerco1.webp",
    content: `
      <h3 class="text-xl font-bold mb-4">¿Por qué es importante elegir bien?</h3>
      <p class="mb-4">Un cerco perimetral no solo define los límites de tu propiedad, sino que también aporta seguridad y estética. Materiales como el alambre tejido, madera tratada o cercos eléctricos tienen ventajas específicas según tu necesidad.</p>
      
      <h3 class="text-xl font-bold mb-4">Factores clave:</h3>
      <ul class="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Clima:</strong> En zonas húmedas, evita materiales corrosibles.</li>
        <li><strong>Seguridad:</strong> Altura y resistencia según el nivel de protección requerido.</li>
        <li><strong>Mantenimiento:</strong> Cercos de PVC requieren menos cuidado que los de madera.</li>
      </ul>
      
      <div class="bg-gray-100 p-4 rounded-lg mb-6">
        <h4 class="font-bold text-brand mb-2">Tip profesional:</h4>
        <p>Para propiedades rurales, combina cercos eléctricos con mallas de alta resistencia.</p>
      </div>
    `,
  },
  {
  id: 2,
  title: "Innovaciones en Alambrados de Alta Resistencia para 2025",
  excerpt: "Descubre los nuevos materiales y diseños que están revolucionando la seguridad perimetral.",
  date: "15 Junio, 2025",
  image: "/placeholder.svg?height=400&width=600",
  content: `
    <h3 class="text-xl font-bold mb-4">Tendencias clave en alambrados:</h3>
    <p class="mb-4">Los cerramientos con alambre de acero galvanizado y recubrimiento de PVC están dominando el mercado por su durabilidad y bajo mantenimiento. Este año, destacan las <strong>mallas torsionadas con triple capa anticorrosiva</strong>.</p>
    
    <h3 class="text-xl font-bold mb-4">Comparativa técnica:</h3>
    <ul class="list-disc pl-6 space-y-2 mb-6">
      <li><strong>Alambre de púas tradicional:</strong> Económico pero requiere mayor mantenimiento (vida útil: 5-7 años).</li>
      <li><strong>Alambre concertina:</strong> Ideal para seguridad extrema (altura recomendada: 2.5m).</li>
      <li><strong>Mallas de alta resistencia:</strong> Combina acero de 12.5 gauge con recubrimiento UV (garantía: 15 años).</li>
    </ul>
    
    <div class="bg-gray-100 p-4 rounded-lg mb-6">
      <h4 class="font-bold text-brand mb-2">Dato técnico:</h4>
      <p>Los alambrados con <strong>sistema de tensión automática</strong> reducen un 40% la deformación por impacto o clima.</p>
    </div>
    
    <h3 class="text-xl font-bold mb-4">Recomendaciones de instalación:</h3>
    <p>Para terrenos irregulares, opta por postes de acero cada 3m con hormigonado profundo (80cm mínimo).</p>
  `,
},
{
  id: 3,
  title: "Cómo Maximizar la Seguridad con Alambre de Púas",
  excerpt: "Errores comunes y soluciones profesionales en instalaciones de cercos punzantes.",
  date: "22 Junio, 2025",
  image: "/Productos/puas/pua-planta1.webp",
  content: `
    <h3 class="text-xl font-bold mb-4">Tipos de alambre de púas:</h3>
    <p class="mb-4">No todos los alambres punzantes son iguales. Los más usados en Argentina son:</p>
    <ul class="list-disc pl-6 space-y-2 mb-6">
      <li><strong>Clásico de 2 hilos:</strong> 14 gauge, económico pero menos resistente a cortes.</li>
      <li><strong>De alta densidad:</strong> 12.5 gauge con púas de acero templado (anti-trepa).</li>
      <li><strong>Concertina helicoidal:</strong> Forma cilíndrica con cuchillas, usado en prisiones y zonas militares.</li>
    </ul>
    
    <h3 class="text-xl font-bold mb-4">Instalación profesional:</h3>
    <div class="grid md:grid-cols-2 gap-4 mb-6">
      <div class="bg-gray-100 p-4 rounded-lg">
        <h4 class="font-bold text-brand mb-2">✅ Correcto:</h4>
        <ul class="list-disc pl-6 space-y-1">
          <li>Ángulo de 45° hacia el exterior.</li>
          <li>Separación máxima de 20cm entre líneas.</li>
          <li>Anclaje con grapas de acero inoxidable.</li>
        </ul>
      </div>
      <div class="bg-red-50 p-4 rounded-lg">
        <h4 class="font-bold text-red-600 mb-2">❌ Evitar:</h4>
        <ul class="list-disc pl-6 space-y-1">
          <li>Postes de madera sin tratamiento antihumedad.</li>
          <li>Púas oxidadas o mal alineadas.</li>
          <li>Altura menor a 1.8m en zonas de riesgo.</li>
        </ul>
      </div>
    </div>
    
    <h3 class="text-xl font-bold mb-4">Normativas legales:</h3>
    <p>En la mayoría de las provincias, los cercos con púas deben tener señalización visible y no pueden invadir espacio público.</p>
  `,
},
{
  id: 4,
  title: "¿Por qué es clave usar zapata en instalaciones de alambrado?",
  excerpt: "La base del alambrado define su durabilidad. Conocé por qué la zapata mejora la resistencia estructural del cerco.",
  date: "15 Junio, 2025",
  image: "/placeholder.svg?height=400&width=600",
  content: `
    <h3 class="text-xl font-bold mb-4">Función de la zapata:</h3>
    <p class="mb-4">La <strong>zapata</strong> es la base de hormigón donde se ancla el poste. Su función principal es <strong>absorber tensiones</strong> y evitar que el poste se hunda, se incline o se mueva con el paso del tiempo.</p>

    <h3 class="text-xl font-bold mb-4">Ventajas estructurales:</h3>
    <ul class="list-disc pl-6 space-y-2 mb-6">
      <li>Distribuye el peso del cerco de forma uniforme en el terreno.</li>
      <li>Evita desplazamientos ante vientos fuertes o suelos blandos.</li>
      <li>Prolonga la vida útil del alambrado al reducir esfuerzos sobre los postes.</li>
    </ul>

    <div class="bg-gray-100 p-4 rounded-lg mb-6">
      <h4 class="font-bold text-brand mb-2">Dato práctico:</h4>
      <p>Se recomienda una zapata de al menos <strong>30x30x60cm</strong> con mezcla de cemento H21 para alambrados de alta resistencia.</p>
    </div>

    <h3 class="text-xl font-bold mb-4">Consejo profesional:</h3>
    <p>En terrenos arcillosos o con pendiente, reforzar la zapata con varillas de hierro mejora significativamente la estabilidad del sistema.</p>
  `,
}


  // ... (otros items con contenido extendido)
];

export default function NewsDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const newsItem = newsItems.find((item) => item.id === Number(params.id));

  if (!newsItem) return notFound();

  return (
    <section className="py-16 construction-pattern">
      <div className="container mx-auto px-4">
        {/* Botón de regreso */}
         <button
            onClick={() => router.back()} // Aquí es donde ocurre la magia
            className="flex items-center text-brand font-bold hover:text-brandHover transition-colors mb-8"
      >
            <ArrowLeft size={16} className="mr-2" />
            Volver
      </button>

        {/* Encabezado */}
        <div className="mb-8">
          <span className="inline-block bg-brand text-white px-4 py-1 mb-4 rounded-md font-bold">
            {newsItem.date}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {newsItem.title}
          </h1>
          <p className="text-lg text-gray-600">{newsItem.excerpt}</p>
        </div>

        {/* Imagen destacada */}
        <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={newsItem.image}
            alt={newsItem.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Contenido detallado (HTML seguro) */}
        <article
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: newsItem.content }}
        />

        {/* CTA al final */}
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