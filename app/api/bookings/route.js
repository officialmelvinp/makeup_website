import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { parseISO, formatISO } from "date-fns"
import { zonedTimeToUtc } from "date-fns-tz"

export async function POST(request) {
  try {
    const data = await request.json()
    console.log("Received booking data:", data)

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const localDateTime = `${data.date}T${data.time}`
    const startDate = zonedTimeToUtc(parseISO(localDateTime), timezone)

    console.log("Formatted start date:", formatISO(startDate))

    // Check if the slot is available
    const { data: conflictingEvents, error: conflictError } = await supabase
      .from("events")
      .select("*")
      .eq("start", formatISO(startDate))

    if (conflictError) {
      console.error("Conflict check error:", conflictError)
      throw conflictError
    }

    if (conflictingEvents?.length > 0) {
      return NextResponse.json({ error: "This slot is already booked" }, { status: 400 })
    }

    // Format the booking data to match database schema
    const bookingData = {
      start: formatISO(startDate),
      title: `${data.service_type} - ${data.client_name}`,
      client_name: data.client_name,
      client_email: data.client_email,
      client_phone: data.client_phone,
      client_whatsapp: data.client_whatsapp || data.client_phone,
      service_type: data.service_type,
      notes: data.notes || null,
      timezone: timezone,
    }

    console.log("Formatted booking data:", bookingData)

    // Insert new booking
    const { data: newBooking, error } = await supabase.from("events").insert(bookingData).select()

    if (error) {
      console.error("Insert error:", error)
      throw error
    }

    console.log("New booking created:", newBooking)

    return NextResponse.json({ message: "Booking successful", booking: newBooking[0] }, { status: 201 })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

