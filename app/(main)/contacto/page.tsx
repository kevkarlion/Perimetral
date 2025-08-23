'use client'
import { useState } from 'react'
import { FaWhatsapp, FaPhoneAlt, FaClock, FaEnvelope, FaPaperPlane } from 'react-icons/fa'


const URL = process.env.NEXT_PUBLIC_BASE_URL;

console.log('url', URL)

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{success: boolean; message: string} | null>(null)



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch(`/api/contacto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({ success: true, message: data.message })
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          mensaje: ''
        })
      } else {
        setSubmitStatus({ success: false, message: data.message || 'Error al enviar el mensaje' })
      }
    } catch (error) {
      setSubmitStatus({ success: false, message: 'Error de conexión' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white  py-8 px-4 sm:px-6 lg:px-8  md:mt-0">
      {/* Hero Section */}
      <section className="border-b border-gray-200 pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#1B1B1B] mb-4">Contactanos</h1>
          <p className="text-base text-[#7A7A7A] max-w-2xl mx-auto">
            Simple y directo, como nos gusta trabajar
          </p>
        </div>
      </section>

      {/* Contenido Principal */}
      <div className="container  px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Columna Izquierda - Formulario */}
          <div className="bg-gray-50 p-8 rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-[#1B1B1B] mb-6">Envíanos un mensaje</h2>
            
            {submitStatus && (
              <div className={`mb-6 p-4 rounded-lg ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1B1B] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1B1B] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1B1B] focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={5}
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border bg-white border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B1B1B] focus:border-transparent"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1B1B1B] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#3A3A3A] transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'Enviando...'
                ) : (
                  <>
                    <FaPaperPlane />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Columna Derecha - Métodos de Contacto */}
          <div>
            <h2 className="text-2xl font-bold text-[#1B1B1B] mb-8">Otros métodos de contacto</h2>

            {/* WhatsApp Directo */}
            <div className="mb-10 bg-white p-6 rounded-xl border border-gray-200 hover:border-[#25D366] transition-all shadow-sm">
              <a
                href="https://wa.me/5492984392148"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 group"
              >
                <div className="bg-[#25D366] p-3 rounded-full text-white flex-shrink-0">
                  <FaWhatsapp className="text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-lg text-[#1B1B1B]">Chat directo por WhatsApp</p>
                  <p className="text-[#7A7A7A] group-hover:text-[#25D366] transition-colors">
                    Conversa con nosotros en tiempo real
                  </p>
                </div>
              </a>
            </div>

            {/* Lista de Contactos */}
            <div className="space-y-4">
              {/* Teléfono */}
              <a 
                href="tel:+542984392148" 
                className="flex items-start gap-4 p-5 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
              >
                <div className="mt-1 text-[#7A7A7A]">
                  <FaPhoneAlt className="text-xl" />
                </div>
                <div>
                  <p className="font-medium text-[#1B1B1B]">Llamada telefónica</p>
                  <p className="text-[#7A7A7A] hover:text-[#1B1B1B] transition-colors">
                    298 439-2148
                  </p>
                </div>
              </a>

              {/* Email */}
              <a 
                href="mailto:perimetral.info@gmail.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
              >
                <div className="mt-1 text-[#7A7A7A]">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <p className="font-medium text-[#1B1B1B]">Correo electrónico</p>
                  <p className="text-[#7A7A7A] hover:text-[#1B1B1B] transition-colors">
                    perimetral.info@gmail.com
                  </p>
                </div>
              </a>

              {/* Horarios */}
              <div className="flex items-start gap-4 p-5 rounded-lg border border-gray-200">
                <div className="mt-1 text-[#7A7A7A]">
                  <FaClock className="text-xl" />
                </div>
                <div>
                  <p className="font-medium text-[#1B1B1B]">Horarios de atención</p>
                  <p className="text-[#7A7A7A]">Lunes a Viernes: 8:00 - 18:00</p>
                  <p className="text-[#7A7A7A]">Sábados: 9:00 - 13:00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}