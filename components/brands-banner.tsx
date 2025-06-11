'use client'
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

   const faqs = [
    {
      question: "¿Por qué elegir su empresa en lugar de comprar materiales por mi cuenta?",
      answer:
        "Ofrecemos **instalación profesional garantizada** y asesoramiento técnico especializado para las condiciones climáticas del Alto Valle (vientos fuertes, humedad). Evita riesgos de instalación incorrecta que deriven en gastos adicionales.",
    },
    {
      question: "¿Los cercos resisten el viento fuerte de la Patagonia?",
      answer:
        "Sí. Usamos **postes de acero galvanizado anclados con hormigón** (1m de profundidad) y alambres de alta tensión con tratamiento anticorrosivo. Nuestros cercos han superado vientos de 90 km/h en pruebas reales en Neuquén.",
    },
    {
      question: "¿Hacen envíos a otras ciudades de Río Negro o Neuquén?",
      answer:
        "Cubrimos todo el **Alto Valle (Río Negro y Neuquén)** con logística propia. Envíos a Cipolletti, Villa Regina, Cinco Saltos y zonas aledañas sin costo adicional en compras mayores a $150.000.",
    },
    {
      question: "¿Qué pasa si el terreno es irregular o tiene pendiente?",
      answer:
        "Adaptamos el cerco con **sistemas escalonados o en desnivel**, usando postes ajustables. Realizamos un relevamiento topográfico gratuito en General Roca y alrededores.",
    },
    {
      question: "¿Ofrecen financiación?",
      answer:
        "Sí. Tenemos **planes de pago en cuotas** sin interés con bancos locales (ej: Banco de Río Negro) y opciones de pago a 30/60 días para clientes registrados.",
    },
    {
      question: "¿Cuánto tiempo tarda la instalación?",
      answer: "Depende del terreno, pero en propiedades estándar (500m²) realizamos la instalación en <strong>2-3 días</strong>. Incluimos soldadura in situ y pintura antioxidante."
    },
    {
      question: "¿Dan garantía? ¿Qué cubre?",
      answer:
        "Garantía de **5 años** en materiales y **2 años** en mano de obra. Cubrimos roturas por defectos de fabricación, corrosión prematura o fallas en la instalación.",
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Resolvemos tus dudas sobre cercos perimetrales en el Alto Valle.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="mb-4 border-b border-gray-200 pb-4"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="flex justify-between items-center w-full text-left font-semibold text-gray-800 hover:text-brand transition-colors"
              >
                <span className="text-lg">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-300 ${
                    activeIndex === index ? "transform rotate-180 text-brand" : "text-gray-500"
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="mt-3 text-gray-600 pl-2">
                  <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-brand p-6 rounded-lg shadow-md text-white text-center">
          <h3 className="text-2xl font-bold mb-4">¿No encontraste tu respuesta?</h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Nuestros técnicos están listos para asesorarte personalmente.
          </p>
          <button className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-8 rounded-md transition-colors">
            Contactar ahora
          </button>
        </div>
      </div>
    </section>
  );
}