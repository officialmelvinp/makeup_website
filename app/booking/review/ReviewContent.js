"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function ReviewContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    // Convert searchParams to an object
    const data = {
      date: searchParams.get("date"),
      time: searchParams.get("time"),
      name: searchParams.get("name"),
      email: searchParams.get("email"),
      phone: searchParams.get("phone"),
      whatsapp: searchParams.get("whatsapp"),
      service: searchParams.get("service"),
      message: searchParams.get("message"),
    }
    console.log("Review page data:", data) // Debug log
    setFormData(data)
  }, [searchParams])

  const handleConfirm = () => {
    router.push(`/booking/payment?${searchParams.toString()}`)
  }

  if (!formData) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <p>
        <strong className="font-semibold">Date:</strong> {formData.date}
      </p>
      <p>
        <strong className="font-semibold">Time:</strong> {formData.time}
      </p>
      <p>
        <strong className="font-semibold">Name:</strong> {formData.name}
      </p>
      <p>
        <strong className="font-semibold">Email:</strong> {formData.email}
      </p>
      <p>
        <strong className="font-semibold">Phone:</strong> {formData.phone}
      </p>
      <p>
        <strong className="font-semibold">WhatsApp:</strong> {formData.whatsapp || "Not provided"}
      </p>
      <p>
        <strong className="font-semibold">Service:</strong> {formData.service}
      </p>
      <p>
        <strong className="font-semibold">Additional Information:</strong> {formData.message || "None"}
      </p>
      <button
        onClick={handleConfirm}
        className="w-full p-3 mt-6 bg-rose-gold text-white rounded-md font-semibold hover:bg-rose-gold-dark transition-colors duration-300"
      >
        Confirm and Proceed to Payment
      </button>
    </div>
  )
}

