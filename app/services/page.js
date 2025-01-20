"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { FaRegMoneyBillAlt, FaClock, FaInfoCircle } from "react-icons/fa"
import { motion } from "framer-motion"

const services = [
  {
    title: "Bridal Makeup",
    description: "Look your absolute best on your special day with our professional bridal makeup services.",
    image: "/t.jpg",
    duration: "2-3 hours",
    details: "Includes consultation, trial run, and day-of makeup application.",
  },
  {
    title: "Special Event Makeup",
    description: "Get ready for any special occasion with our expert makeup application.",
    image: "/b.jpg",
    duration: "1-2 hours",
    details: "Perfect for proms, galas, or any important event.",
  },
  {
    title: "Photoshoot Makeup",
    description: "Camera-ready makeup that will make you look stunning in every shot.",
    image: "/h.jpg",
    duration: "1-2 hours",
    details: "Specialized techniques for both studio and outdoor lighting.",
  },
  {
    title: "Makeup Lessons",
    description: "Learn professional techniques to enhance your everyday makeup routine.",
    image: "/a.jpg",
    duration: "2 hours",
    details: "One-on-one or group lessons available. Take home a personalized beauty guide.",
  },
]

export default function Services() {
  const [selectedService, setSelectedService] = useState(null)

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-16 text-plum-800 font-playfair">Our Exclusive Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {services.map((service, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-xl rounded-lg overflow-hidden transform transition duration-500 hover:scale-105"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="relative">
              <Image
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                width={600}
                height={400}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-lg font-semibold">Learn More</span>
              </div>
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-semibold mb-4 text-plum-700 font-playfair">{service.title}</h2>
              <p className="text-charcoal-600 text-lg leading-relaxed font-lato mb-4">{service.description}</p>
              <div className="flex items-center text-rose-gold mb-4">
                <FaClock className="mr-2" />
                <span>{service.duration}</span>
              </div>
              <button
                onClick={() => setSelectedService(service)}
                className="text-rose-gold hover:text-rose-gold-600 transition duration-300 flex items-center"
              >
                <FaInfoCircle className="mr-2" />
                More Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-16">
        <Link
          href="/prices"
          className="inline-flex items-center px-8 py-4 bg-rose-gold text-white rounded-full hover:bg-rose-gold-600 transition duration-300 text-lg font-semibold font-lato"
        >
          <FaRegMoneyBillAlt className="mr-2" />
          View Our Price List
        </Link>
      </div>

      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-plum-700 font-playfair">{selectedService.title}</h2>
            <p className="text-charcoal-600 mb-4 font-lato">{selectedService.details}</p>
            <button
              onClick={() => setSelectedService(null)}
              className="bg-rose-gold text-white px-4 py-2 rounded hover:bg-rose-gold-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

