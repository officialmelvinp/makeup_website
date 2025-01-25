import Image from "next/image"
import Link from "next/link"

export default function Gallery() {
  const galleryImages = [
    { src: "/a.jpg", alt: "Bridal Makeup" },
    { src: "/z5.jpg", alt: "Special Event Makeup" },
    { src: "/z2.jpg", alt: "Photoshoot Makeup" },
    { src: "/z4.jpg", alt: "Avant-Garde Makeup" },
    { src: "/twitter.jpg", alt: "Editorial Makeup" },
    { src: "/og-image.jpg", alt: "Glamour Makeup" },
    { src: "/sub1.jpg", alt: "Natural Makeup" },
    { src: "/sub2.jpg", alt: "Evening Makeup" },
  ]

  return (
    <div className="container mx-auto px-4 py-16 mt-20">
      <h1 className="text-4xl font-bold text-center mb-12 text-plum-800 font-playfair">Our Makeup Gallery</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {galleryImages.map((image, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
              className="rounded-lg transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <p className="text-white text-xl font-semibold">{image.alt}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <Link
          href="/contact"
          className="bg-rose-gold text-white px-8 py-4 rounded-full hover:bg-rose-gold-600 transition duration-300 text-lg font-semibold font-lato"
        >
          Book Your Session
        </Link>
      </div>
    </div>
  )
}

