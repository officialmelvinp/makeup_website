"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function BookingFormContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    service: "",
    message: "",
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const date = searchParams.get("date")
  const time = searchParams.get("time")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Create URL parameters
    const params = new URLSearchParams({
      ...formData,
      date,
      time,
    })

    // Log the data being passed
    console.log("Form data being passed:", Object.fromEntries(params))

    router.push(`/booking/review?${params}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-gold"
          required
        />
      </div>
      {/* Add other form fields here */}
      <button
        type="submit"
        className="w-full p-3 bg-rose-gold text-white rounded-md font-semibold hover:bg-rose-gold-dark transition-colors duration-300"
      >
        Review Booking
      </button>
    </form>
  )
}

