"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
import { Search } from "lucide-react"

const DynamicSlider = dynamic(() => import("react-slick").then((mod) => mod.default), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const services = [
    {
      title: "Bridal Makeup",
      description: "Make your special day unforgettable with our expert bridal makeup services.",
    },
    {
      title: "Special Event Makeup",
      description: "Look stunning for any occasion with our tailored special event makeup.",
    },
    {
      title: "Photoshoot Makeup",
      description: "Camera-ready looks that capture your best self for any photoshoot.",
    },
  ]

  const recentTransformations = [
    {
      src: "/a.jpg",
      alt: "Bridal Makeup Transformation",
      caption: "Elegant bridal makeup for a destination wedding in Dubai. Completed in just 45 minutes!",
    },
    {
      src: "/z5.jpg",
      alt: "Special Event Makeup Transformation",
      caption: "Glamorous look for a red carpet event in London. This bold style took only 30 minutes to create.",
    },
    {
      src: "/z2.jpg",
      alt: "Photoshoot Makeup Transformation",
      caption: "Natural, dewy look for a summer fashion photoshoot. Achieved this fresh face in 20 minutes.",
    },
    {
      src: "/z4.jpg",
      alt: "Avant-Garde Makeup Transformation",
      caption:
        "Artistic avant-garde makeup for a high-fashion editorial. This intricate design took 2 hours to perfect.",
    },
    {
      src: "/twitter.jpg",
      alt: "Celebrity Makeup Transformation",
      caption: "Red carpet-ready look for a celebrity client. Completed in 1 hour for a major awards show.",
    },
    {
      src: "/og-image.jpg",
      alt: "Dramatic Evening Makeup Transformation",
      caption: "Sultry evening makeup for a gala event. This smokey eye look was done in just 40 minutes.",
    },
    {
      src: "/sub1.jpg",
      alt: "Natural Daytime Makeup Transformation",
      caption: "Effortless 'no-makeup' makeup look for a daytime event. Achieved this natural glow in 15 minutes.",
    },
    {
      src: "/sub2.jpg",
      alt: "Vintage-Inspired Makeup Transformation",
      caption: "1950s-inspired makeup for a themed wedding. This retro look was created in 35 minutes.",
    },
    {
      src: "/placeholder.svg",
      alt: "Cultural Makeup Transformation",
      caption: "Traditional bridal makeup for a multicultural wedding. This intricate look took 1.5 hours to complete.",
    },
    {
      src: "/placeholder.svg",
      alt: "Halloween Makeup Transformation",
      caption:
        "Spooky yet glamorous Halloween makeup. This dramatic transformation required 2.5 hours of detailed work.",
    },
  ]

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    fade: true,
    cssEase: "linear",
  }

  return (
    <div className="bg-champagne-50">
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-rose-100 to-pink-200 overflow-hidden pt-24 md:pt-32">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Image
                src="/sub1.jpg"
                alt="Dolapo Udekwe - Professional Makeup Artist"
                width={600}
                height={600}
                className="rounded-lg shadow-xl"
                priority
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-plum-800 font-playfair">Dolapo Udekwe</h1>
              <p className="text-xl md:text-2xl mb-4 md:mb-6 text-plum-600 font-lato">Professional Makeup Artistry</p>
              <p className="text-base md:text-lg mb-6 md:mb-8 text-charcoal-600 font-lato">
                Transform your look with expert makeup artistry. Whether it&apos;s for your wedding day, a special
                event, or a professional photoshoot, I&apos;m here to enhance your natural beauty and make you feel
                confident and radiant.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <Link
                  href="/booking"
                  className="bg-rose-gold text-white px-6 py-3 rounded-full hover:bg-rose-gold-600 transition duration-300 text-base md:text-lg font-semibold font-lato text-center"
                >
                  Book Now
                </Link>
                <Link
                  href="/gallery"
                  className="bg-rose-gold text-white px-6 py-3 rounded-full hover:bg-rose-gold-600 transition duration-300 text-base md:text-lg font-semibold font-lato text-center"
                >
                  Explore Gallery
                </Link>
              </div>
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search services, gallery, or prices..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow px-4 py-2 rounded-l-full border-2 border-rose-gold focus:outline-none focus:border-rose-gold-600"
                />
                <button
                  type="submit"
                  className="bg-rose-gold text-white px-4 py-2 rounded-r-full hover:bg-rose-gold-600 transition duration-300"
                >
                  <Search size={24} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Services section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-plum-800 font-playfair">Our Signature Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-champagne-100 p-8 rounded-lg text-center shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <h3 className="text-2xl font-semibold mb-4 text-plum-700 font-playfair">{service.title}</h3>
                <p className="mb-6 text-charcoal-600 font-lato">{service.description}</p>
                <Link
                  href="/services"
                  className="text-rose-gold hover:text-rose-gold-600 font-semibold font-lato transition duration-300"
                >
                  Discover More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Transformations section */}
      <section className="py-24 bg-champagne-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-plum-800 font-playfair">Recent Transformations</h2>
          {mounted && (
            <div className="max-w-3xl mx-auto">
              <DynamicSlider {...sliderSettings}>
                {recentTransformations.map((image, index) => (
                  <div key={index} className="px-2">
                    <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                      <Image
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-lg text-charcoal-600 font-lato">{image.caption}</p>
                    </div>
                  </div>
                ))}
              </DynamicSlider>
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              href="/gallery"
              className="bg-rose-gold text-white px-8 py-4 rounded-full hover:bg-rose-gold-600 transition duration-300 text-lg font-semibold font-lato"
            >
              Explore Our Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Schema markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BeautySalon",
            name: "DolapoUdekwe Professional Makeup Artistry",
            image: "https://www.dolapoudekwe.co.uk/logo.jpeg",
            address: {
              "@type": "PostalAddress",
              streetAddress: "123 Makeup Street",
              addressLocality: "Purfleet",
              addressRegion: "Essex",
              postalCode: "RM19 1ZZ",
              addressCountry: "GB",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "51.4839",
              longitude: "0.2380",
            },
            url: "https://www.dolapoudekwe.co.uk",
            telephone: "+44-7445-544-254",
            priceRange: "££",
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "23:59",
              },
            ],
            servesCuisine: "Makeup Services",
          }),
        }}
      />
    </div>
  )
}

