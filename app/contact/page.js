"use client"

import { useState } from "react"
import { FaWhatsapp, FaEnvelope, FaPhone } from "react-icons/fa"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitStatus, setSubmitStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message")
      }

      setSubmitStatus({ type: "success", message: data.message })
      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      console.error("Error sending message:", error)
      setSubmitStatus({ type: "error", message: error.message || "Failed to send message. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-12 text-plum-800 font-playfair">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-plum-700 font-playfair">Get in Touch</h2>
          <p className="mb-6 text-charcoal-600 font-lato">
            Have questions or want to book a consultation? Reach out to us using any of the methods below or fill out
            the contact form.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <FaWhatsapp className="text-2xl text-green-500 mr-4" aria-hidden="true" />
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-plum-600 hover:text-plum-800"
              >
                WhatsApp
              </a>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="text-2xl text-rose-gold mr-4" aria-hidden="true" />
              <a href="mailto:info@dolapoudekwe.co.uk" className="text-plum-600 hover:text-plum-800">
                contact@dolapoudekwe.co.uk
              </a>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-2xl text-blue-500 mr-4" aria-hidden="true" />
              <a href="tel:+447445544254" className="text-plum-600 hover:text-plum-800">
                +44 7445 544 254
              </a>
            </div>
          </div>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-charcoal-600">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-white border border-gray-300 text-charcoal-600 text-sm rounded-lg focus:ring-rose-gold focus:border-rose-gold block w-full p-2.5"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-charcoal-600">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-white border border-gray-300 text-charcoal-600 text-sm rounded-lg focus:ring-rose-gold focus:border-rose-gold block w-full p-2.5"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-charcoal-600">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                className="bg-white border border-gray-300 text-charcoal-600 text-sm rounded-lg focus:ring-rose-gold focus:border-rose-gold block w-full p-2.5"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-rose-gold hover:bg-rose-gold-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
          {submitStatus && (
            <div
              className={`mt-4 p-2 rounded ${
                submitStatus.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
              role="alert"
            >
              {submitStatus.message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

