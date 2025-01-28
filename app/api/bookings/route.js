import { parseISO, formatISO } from "date-fns"
import { zonedTimeToUtc } from "date-fns-tz"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request) {
  try {
    const { start, name, email, phone, whatsapp, service, message, timezone } = await request.json()

    const startDate = zonedTimeToUtc(parseISO(start), timezone)

    // Check if the slot is available
    const { data: conflictingEvents, error: conflictError } = await supabase
      .from("events")
      .select("*")
      .eq("start", formatISO(startDate))

    if (conflictError) throw conflictError

    if (conflictingEvents.length > 0) {
      return NextResponse.json({ error: "This slot is already booked" }, { status: 400 })
    }

    // Insert new booking
    const { data: newBooking, error } = await supabase
      .from("events")
      .insert({
        start: formatISO(startDate),
        title: `Booked - ${service}`,
        client_name: name,
        client_email: email,
        client_phone: phone,
        client_whatsapp: whatsapp,
        service_type: service,
        notes: message,
        timezone: timezone,
      })
      .select()

    if (error) throw error

    return NextResponse.json({ message: "Booking successful", booking: newBooking[0] }, { status: 201 })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

