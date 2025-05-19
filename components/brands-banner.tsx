import Image from "next/image"

const brands = [
  { id: 1, name: "Marca 1", logo: "/placeholder.svg?height=100&width=200" },
  { id: 2, name: "Marca 2", logo: "/placeholder.svg?height=100&width=200" },
  { id: 3, name: "Marca 3", logo: "/placeholder.svg?height=100&width=200" },
  { id: 4, name: "Marca 4", logo: "/placeholder.svg?height=100&width=200" },
  { id: 5, name: "Marca 5", logo: "/placeholder.svg?height=100&width=200" },
  { id: 6, name: "Marca 6", logo: "/placeholder.svg?height=100&width=200" },
]

export default function BrandsBanner() {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-block bg-orange-600 text-white px-4 py-1 mb-4 rounded-md font-bold">PROVEEDORES</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trabajamos con las mejores marcas</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="flex justify-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-16 w-32 grayscale hover:grayscale-0 transition-all duration-300">
                <Image src={brand.logo || "/placeholder.svg"} alt={brand.name} fill className="object-contain" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
