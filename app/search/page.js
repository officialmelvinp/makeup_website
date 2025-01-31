import { searchServices, searchGallery, searchPrices } from "@/lib/search"
import Link from "next/link"
import Image from "next/image"

export const dynamic = "force-dynamic"

export default async function SearchResults({ searchParams }) {
  const query = searchParams.q || ""
  const services = await searchServices(query)
  const gallery = await searchGallery(query)
  const prices = await searchPrices(query)

  const hasResults = services.length > 0 || gallery.length > 0 || prices.length > 0

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results for &quot;{query}&quot;</h1>

      {services.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Services</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <li key={service.id} className="bg-white p-4 rounded-lg shadow">
                <Link href={`/services/${service.slug}`} className="block hover:text-rose-gold">
                  <h3 className="font-semibold">{service.name}</h3>
                  <p>{service.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <div key={item.id} className="relative aspect-square">
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                  <p>{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {prices.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Prices</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prices.map((price) => (
              <li key={price.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold">{price.name}</h3>
                <p>{price.price}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!hasResults && (
        <p className="text-lg">
          {isNaN(Number.parseFloat(query.replace("£", "").trim()))
            ? `No results found for "${query}". Please try a different search term.`
            : `We do not have a service for the price £${query}. Please try a different price or search term.`}
        </p>
      )}
    </div>
  )
}

