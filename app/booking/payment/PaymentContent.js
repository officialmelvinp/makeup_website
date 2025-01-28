"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function PaymentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePayment = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const bookingData = {
        client_name: searchParams.get("name"),
        client_email: searchParams.get("email"),
        client_phone: searchParams.get("phone"),
        client_whatsapp: searchParams.get("whatsapp"),
        service_type: searchParams.get("service"),
        notes: searchParams.get("message"),
        date: searchParams.get("date"),
        time: searchParams.get("time"),
      }

      console.log("Sending booking data:", bookingData)

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Booking failed")
      }

      console.log("Booking response:", data)
      router.push(`/booking/confirmation?id=${data.booking.id}`)
    } catch (error) {
      console.error("Error during payment:", error)
      setError(error.message || "Payment failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <p className="text-lg mb-6 text-center">PayPal integration will be added here.</p>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <button
        onClick={handlePayment}
        className="w-full p-3 bg-rose-gold text-white rounded-md font-semibold hover:bg-rose-gold-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Simulate Payment"}
      </button>
    </>
  )
}

