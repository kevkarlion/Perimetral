import { 
  Truck, 
  Wrench, 
  Headset, 
  ClipboardCheck, 
  ShieldCheck,
  UserCircle,
  Construction,
  MapPin 
} from "lucide-react"

export default function ServicesBanner() {
  const services = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Transporte Gratis",
      description: "Sin costo en Roca, Cipolletti y Neuquén"
    },
    {
      icon: <Construction className="h-6 w-6" />,
      title: "Colocación",
      description: "Instalación profesional por expertos"
    },
    {
      icon: <Headset className="h-6 w-6" />,
      title: "Posventa",
      description: "Soporte continuo después de la compra"
    },
    {
      icon: <ClipboardCheck className="h-6 w-6" />,
      title: "Asesoramiento",
      description: "Guía experta para tu proyecto"
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Garantía",
      description: "Respaldamos nuestros productos"
    },
    {
      icon: <UserCircle className="h-6 w-6" />,
      title: "Atención Personalizada",
      description: "Soluciones adaptadas a tus necesidades"
    },
    {
      icon: <Wrench className="h-6 w-6" />,
      title: "Reparación y Mantenimiento",
      description: "Servicio técnico especializado"
    },
    {
        icon: <MapPin className="h-6 w-6" />,
        title: "Envíos a todo el país",
        description: "Logística segura y seguimiento personalizado."
      }
    ];

  return (
    <section className="py-10 px-2 bg-background text-foreground">
      <div className="container mx-auto px-6 ">
        <div className="flex flex-col items-center justify-center">

          <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          ¿Por qué elegirnos?
          </h2>
          <p className="max-w-[700px] pb-8 font-bold  text-center text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Ofrecemos soluciones integrales para la seguridad perimetral de su propiedad
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-start">
                <div className="bg-brand/10 p-3 rounded-lg mr-4 text-brand">
                  {service.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{service.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}