import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { productos } from '@/data/products'; // Asegúrate de que la ruta sea correcta

export default function ProductoDetalle({ params }: { params: { id: string } }) {
  const producto = productos.find(p => p.id.toString() === params.id);
  
  if (!producto) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <Link href="/catalogo" className="text-blue-500 mb-4 inline-block">
        ← Catálogo
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
          <Image
            src={producto.src}
            alt={producto.nombre}
            width={600}
            height={400}
            className="w-full rounded-lg"
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold">{producto.nombre}</h1>
          <p className="text-2xl text-blue-600 my-4">{producto.precio}</p>
          
          <div className="prose max-w-none">
            <p>{producto.descripcionLarga}</p>
            <ul className="list-disc pl-5 mt-4">
              {producto.especificaciones?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}