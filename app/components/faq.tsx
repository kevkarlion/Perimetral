'use client'
import { ChevronDown, ShieldCheck, Truck, MapPin, CircleDollarSign, Clock, HelpCircle } from "lucide-react";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "¿Por qué elegir su empresa en lugar de comprar materiales por mi cuenta?",
      answer: "Ofrecemos <strong>instalación profesional garantizada</strong> y asesoramiento técnico especializado para las condiciones climáticas del Alto Valle (vientos fuertes, humedad). Evita riesgos de instalación incorrecta que deriven en gastos adicionales.",
      icon: <ShieldCheck className="text-brand" size={20} />
    },
    {
      question: "¿Los cercos resisten el viento fuerte de la Patagonia?",
      answer: "Sí. Usamos <strong>postes de acero galvanizado anclados con hormigón</strong> (60cm de profundidad) y alambres de alta tensión con tratamiento anticorrosivo. Nuestros cercos han superado vientos de 90 km/h en pruebas reales en Neuquén.",
      icon: <MapPin className="text-brand" size={20} />
    },
    {
      question: "¿Hacen envíos a otras ciudades de Río Negro o Neuquén?",
      answer: "Cubrimos todo el <strong>Alto Valle (Río Negro y Neuquén)</strong> con logística propia. Envíos a Cipolletti y General Roca sin cargo.",
      icon: <Truck className="text-brand" size={20} />
    },
    {
      question: "¿Qué pasa si el terreno es irregular o tiene pendiente?",
      answer: "Adaptamos el cerco con <strong>sistemas escalonados o en desnivel</strong>, usando postes ajustables. Realizamos un relevamiento topográfico gratuito en General Roca y alrededores.",
      icon: <HelpCircle className="text-brand" size={20} />
    },
    {
      question: "¿Ofrecen financiación?",
      answer: "Sí. Tenemos <strong>planes de pago en cuotas</strong> sin interés con bancos. Contamos con un esquema de precios preferenciales para clientes que confían de manera continua en nuestros servicios.",
      icon: <CircleDollarSign className="text-brand" size={20} />
    },
    {
      question: "¿Cuánto tiempo tarda la instalación?",
      answer: "Depende del terreno, pero en propiedades estándar (500m²) realizamos la instalación en <strong>7-15 días</strong>.",
      icon: <Clock className="text-brand" size={20} />
    },
    {
      question: "¿Dan garantía? ¿Qué cubre?",
      answer: "Garantía de <strong>6 meses</strong> en materiales y mano de obra. Cubrimos roturas por defectos de fabricación, corrosión prematura o fallas en la instalación.",
      icon: <ShieldCheck className="text-brand" size={20} />
    },
  ];

  return (
    <section className="bg-background text-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="max-w-[700px] pb-8 font-semibold  text-center text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Resolvemos tus dudas sobre cercos perimetrales en el Alto Valle
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className={`flex items-center justify-between w-full p-6 text-left ${activeIndex === index ? 'bg-gray-50' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-brand/10 rounded-lg">
                    {faq.icon}
                  </div>
                  <span className="text-lg font-medium text-gray-800">{faq.question}</span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 ml-4 transition-transform duration-300 ${
                    activeIndex === index ? "transform rotate-180 text-brand" : "text-gray-400"
                  }`}
                />
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  activeIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6 pt-2 text-gray-600 border-t border-gray-100">
                  <div className="prose" dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Moderno */}
        <div className="mt-16 bg-gradient-to-r from-brand to-brand-dark p-0.5 rounded-xl shadow-lg">
          <div className="bg-white rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 hover">¿Necesitas más información?</h3>
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