import { searchContent } from "@/lib/services"
import Link from "next/link"
import Image from "next/image"

export default async function SearchResults({ searchParams }) {
  const query = searchParams.q || ""
  const { services, images } = await searchContent(query)

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-6 text-plum-800 font-playfair">Search Results for &quot;{query}&quot;</h1>

      {services.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-plum-700 font-playfair">Services</h2>
          <ul className="space-y-4">
            {services.map((service) => (
              <li key={service.id} className="bg-white shadow rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2 text-plum-700 font-playfair">{service.title}</h3>
                <p className="text-charcoal-600 mb-4">{service.description}</p>
                <Link
                  href={`/services#${service.id}`}
                  className="text-rose-gold hover:text-rose-gold-600 font-semibold"
                >
                  Learn More
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {images.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-plum-700 font-playfair">Gallery Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={image.id || index} className="relative aspect-square">
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-center">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {services.length === 0 && images.length === 0 && (
        <p className="text-lg text-charcoal-600">No results found. Please try a different search term.</p>
      )}
    </div>
  )
}

