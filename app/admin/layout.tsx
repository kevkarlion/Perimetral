// Este layout solo se aplicará a rutas dentro de /admin/*
import '../globals.css' // Asegúrate de que este archivo exista y tenga los estilos globales necesarios

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white">
        {/* Aquí NO incluimos el navbar */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}