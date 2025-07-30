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
  excerpt: "Todo lo que necesitás saber para proteger tu terreno con los cercos más resistentes del mercado.",
  date: "10 Mayo, 2025",
  image: "/consejos/cerco1.webp",
  content: `
    <h3 class="text-xl font-bold mb-4">La protección empieza por un buen cerco</h3>
    <p class="mb-4">En PERIMETRAL, nos especializamos en ofrecer soluciones duraderas y confiables para el cercado de tu propiedad. Ya sea un terreno urbano, rural o una chacra, contamos con opciones robustas que se adaptan a tus necesidades reales. Porque entendemos que un buen cerco no solo delimita, también protege.</p>

    <h3 class="text-xl font-bold mb-4">¿Qué tipo de cerco necesitás?</h3>
    <p class="mb-4">No todos los terrenos requieren el mismo tipo de cerramiento. Por eso te ayudamos a elegir entre nuestras opciones más confiables:</p>

    <ul class="list-disc pl-6 space-y-2 mb-6">
      <li><strong>Tejido romboidal galvanizado:</strong> Ideal para cercos perimetrales clásicos. Flexible, resistente y con excelente terminación.</li>
      <li><strong>Alambre de alta resistencia:</strong> Perfecto para grandes extensiones o zonas con alta tensión de uso. Requiere menos postes, lo que optimiza la instalación.</li>
      <li><strong>Alambre de púas:</strong> Opción eficiente para reforzar el límite de propiedades rurales o ganaderas. Alta resistencia y fácil colocación.</li>
    </ul>

    <h3 class="text-xl font-bold mb-4">Factores a considerar al elegir tu cerco</h3>
    <ul class="list-disc pl-6 space-y-2 mb-6">
      <li><strong>Ubicación:</strong> Para zonas rurales, el alambre de alta resistencia es clave por su bajo mantenimiento y larga vida útil.</li>
      <li><strong>Función:</strong> ¿Querés solo delimitar? ¿O también reforzar seguridad? El tejido romboidal permite ambas opciones con excelente estética.</li>
      <li><strong>Durabilidad:</strong> Todos nuestros productos son galvanizados o preparados para resistir a la intemperie.</li>
    </ul>

    <div class="bg-gray-100 p-4 rounded-lg mb-6">
      <h4 class="font-bold text-brand mb-2">Tip PERIMETRAL:</h4>
      <p>Si necesitás cubrir grandes distancias, combiná postes bien distribuidos con alambre de alta resistencia para lograr un cerco firme, duradero y económico.</p>
    </div>

    <h3 class="text-xl font-bold mb-4">¿Por qué elegirnos?</h3>
    <p class="mb-4">En PERIMETRAL no solo vendemos materiales, ofrecemos soluciones. Te asesoramos desde el primer momento para que elijas el cerco más adecuado según el terreno, el uso y tu presupuesto. Contamos con años de experiencia, entrega inmediata y productos de primera calidad.</p>

    <h3 class="text-xl font-bold mb-4">Listo para cercar tu propiedad</h3>
    <p class="mb-4">Contactanos hoy mismo y encontrá el equilibrio perfecto entre protección, estética y durabilidad. Estamos listos para ayudarte a asegurar tu terreno con los mejores materiales del mercado.</p>
  `,
}

,
 {
  id: 2,
  title: "Innovaciones en Alambrados de Alta Resistencia para 2025",
  excerpt: "Descubrí las nuevas tecnologías aplicadas al cercado rural y urbano que marcan tendencia este año.",
  date: "16 Junio, 2025",
  image: "/panoramica-completo.webp",
  content: `
    <h3 class="text-xl font-bold mb-4">Más allá del alambre: tecnología aplicada al campo</h3>
    <p class="mb-4">El 2025 trae consigo avances significativos en materiales y técnicas de instalación para alambrados de alta resistencia. En PERIMETRAL estamos a la vanguardia, incorporando soluciones pensadas para maximizar la durabilidad, reducir el mantenimiento y mejorar la eficiencia de cada instalación.</p>

    <h3 class="text-xl font-bold mb-4">¿Qué hay de nuevo este año?</h3>
    <ul class="list-disc pl-6 space-y-2 mb-6">
      <li><strong>Alambres con zinc-aluminio:</strong> Mayor resistencia a la corrosión en comparación con el galvanizado tradicional. Ideal para climas exigentes.</li>
      <li><strong>Alta tensión sin deformación:</strong> Los nuevos tratamientos térmicos permiten que el alambre conserve su forma y tensión incluso ante cambios de temperatura y uso intensivo.</li>
      <li><strong>Nudos reforzados:</strong> Mejor anclaje entre hilos para estructuras más sólidas y seguras, especialmente en terrenos irregulares.</li>
      <li><strong>Bobinas más largas:</strong> Mayor rendimiento por unidad. Menos cortes, menos empalmes y más velocidad de instalación.</li>
    </ul>

    <div class="bg-gray-100 p-4 rounded-lg mb-6">
      <h4 class="font-bold text-brand mb-2">Tip PERIMETRAL:</h4>
      <p>Combiná alambre de alta resistencia con postes correctamente alineados y tensores modernos para lograr cercos firmes que duren más de 20 años sin mantenimiento mayor.</p>
    </div>

    <h3 class="text-xl font-bold mb-4">Ventajas reales para tu propiedad</h3>
    <ul class="list-disc pl-6 space-y-2 mb-6">
      <li><strong>Menos mantenimiento:</strong> Alambres tratados que no se oxidan ni se aflojan con el tiempo.</li>
      <li><strong>Mayor duración:</strong> Tecnología pensada para durar décadas, incluso en condiciones climáticas adversas.</li>
      <li><strong>Ahorro a largo plazo:</strong> Invertís una vez, cercás para siempre.</li>
    </ul>

    <h3 class="text-xl font-bold mb-4">PERIMETRAL: siempre un paso adelante</h3>
    <p class="mb-4">En PERIMETRAL no solo vendemos alambrados: ofrecemos soluciones técnicas y confiables que evolucionan con vos. Si buscás calidad, asesoramiento experto y productos que marcan tendencia, estás en el lugar indicado.</p>

    <p class="mb-4">Contactanos hoy y conocé cómo las nuevas tecnologías pueden transformar tu campo o terreno urbano. Estamos listos para ayudarte a cercar con lo último en innovación y resistencia.</p>
  `,
},

{
  id: 3,
  title: "Cómo Maximizar la Seguridad con Alambre de Púas",
  excerpt: "Errores comunes y soluciones profesionales en instalaciones de cercos punzantes.",
  date: "22 Junio, 2025",
  image: "/Productos/puas/pua3.webp",
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