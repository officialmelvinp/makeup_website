"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"

const DynamicSlider = dynamic(() => import("react-slick").then((mod) => mod.default), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
    { src: "/a.jpg", alt: "Bridal Makeup Transformation" },
    { src: "/z5.jpg", alt: "Special Event Makeup Transformation" },
    { src: "/z2.jpg", alt: "Photoshoot Makeup Transformation" },
    { src: "/z4.jpg", alt: "Avant-Garde Makeup Transformation" },
    { src: "/twitter.jpg", alt: "Avant-Garde Makeup Transformation" },
    { src: "/og-image.jpg", alt: "Avant-Garde Makeup Transformation" },
    { src: "/sub1.jpg", alt: "Avant-Garde Makeup Transformation" },
    { src: "/sub2.jpg", alt: "Bridal Makeup Transformation" },
  ]

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
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
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
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
            <DynamicSlider {...sliderSettings}>
              {recentTransformations.map((image, index) => (
                <div key={index} className="px-2">
                  <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 25vw"
                      style={{ objectFit: "cover" }}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </DynamicSlider>
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

