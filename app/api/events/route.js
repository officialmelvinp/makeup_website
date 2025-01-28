import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { parseISO, formatISO, subHours, addHours } from "date-fns"
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz"

export async function GET() {
  try {
    const { data: results, error } = await supabase.from("events").select("*").order("start", { ascending: false })

    if (error) throw error

    const adjustedResults = results.map((event) => {
      try {
        const parsedDate = parseISO(event.start)
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date")
        }
        const zonedDate = utcToZonedTime(parsedDate, event.timezone || "UTC")
        return {
          ...event,
          start: formatInTimeZone(zonedDate, event.timezone || "UTC", "yyyy-MM-dd'T'HH:mm:ssXXX"),
        }
      } catch (error) {
        console.error(`Error parsing date for event ${event.id}:`, error)
        return {
          ...event,
          start: "Invalid Date",
        }
      }
    })

    return NextResponse.json(adjustedResults)
  } catch (error) {
    console.error("Database query error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { start, title, name, email, phone, whatsapp, service, message, timezone } = await request.json()

    if (!timezone) {
      return NextResponse.json({ error: "Timezone is required" }, { status: 400 })
    }

    const startDate = parseISO(start)
    if (isNaN(startDate.getTime())) {
      return NextResponse.json({ error: "Invalid start date" }, { status: 400 })
    }

    // Convert the start time to UTC for storage
    const utcStartDate = formatISO(startDate)

    // Check for conflicting events
    const { data: conflictingEvents, error: conflictError } = await supabase
      .from("events")
      .select("*")
      .gte("start", formatISO(subHours(startDate, 2)))
      .lt("start", formatISO(addHours(startDate, 2)))

    if (conflictError) throw conflictError

    if (conflictingEvents.length > 0) {
      return NextResponse.json(
        {
          error:
            "This time slot is already booked. Please choose a time at least two hours apart from existing bookings.",
        },
        { status: 400 },
      )
    }

    // Insert new event
    const { data: newEvent, error: insertError } = await supabase
      .from("events")
      .insert({
        start: utcStartDate,
        title,
        client_name: name,
        client_email: email,
        client_phone: phone,
        client_whatsapp: whatsapp || phone,
        service_type: service,
        notes: message,
        timezone,
      })
      .select()

    if (insertError) throw insertError

    return NextResponse.json({ id: newEvent[0].id }, { status: 201 })
  } catch (error) {
    console.error("Database query error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

