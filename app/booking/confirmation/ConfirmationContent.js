"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { FaWhatsapp } from "react-icons/fa"
import { supabase } from "@/lib/supabase"
import { formatInTimeZone } from "date-fns-tz"

export default function ConfirmationContent() {
  const [bookingDetails, setBookingDetails] = useState(null)
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("id")

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails(bookingId)
    }
  }, [bookingId])

  const fetchBookingDetails = async (id) => {
    const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching booking details:", error)
    } else {
      setBookingDetails(data)
    }
  }

  if (!bookingDetails) {
    return <div>Loading booking details...</div>
  }

  return (
    <>
      <p className="text-lg mb-4">
        Thank you for your booking, <span className="font-semibold">{bookingDetails.client_name}</span>.
      </p>
      <p className="text-lg mb-6">
        We look forward to seeing you on{" "}
        <span className="font-semibold">
          {formatInTimeZone(new Date(bookingDetails.start), bookingDetails.timezone, "MMMM d, yyyy")}
        </span>{" "}
        at{" "}
        <span className="font-semibold">
          {formatInTimeZone(new Date(bookingDetails.start), bookingDetails.timezone, "HH:mm")}
        </span>
        .
      </p>
      <div className="text-center">
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP}?text=Hello, I've just made a booking (ID: ${bookingId}). I have a question about my booking.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors text-lg font-semibold"
        >
          <FaWhatsapp className="mr-2 text-2xl" />
          Contact Us on WhatsApp
        </a>
      </div>
    </>
  )
}

