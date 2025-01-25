import { NextResponse } from "next/server"
import db from "@/lib/db"
import { parseISO, formatISO } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"

export async function GET() {
  try {
    const results = await db.query("SELECT *, timezone FROM events ORDER BY start DESC")

    const adjustedResults = results.rows.map((event) => {
      try {
        const parsedDate = new Date(event.start)
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date")
        }
        return {
          ...event,
          start: formatInTimeZone(parsedDate, event.timezone || "UTC", "yyyy-MM-dd'T'HH:mm:ssXXX"),
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

    const startDate = new Date(start)
    if (isNaN(startDate.getTime())) {
      return NextResponse.json({ error: "Invalid start date" }, { status: 400 })
    }

    const utcStartDate = new Date(startDate.toUTCString())

    const conflictingEvents = await db.query(
      "SELECT * FROM events WHERE start >= $1::timestamp - INTERVAL '2 hours' AND start < $1::timestamp + INTERVAL '2 hours'",
      [formatISO(utcStartDate)],
    )

    if (conflictingEvents.rows.length > 0) {
      return NextResponse.json(
        {
          error:
            "This time slot is already booked. Please choose a time at least two hours apart from existing bookings.",
        },
        { status: 400 },
      )
    }

    const result = await db.query(
      "INSERT INTO events (start, title, client_name, client_email, client_phone, client_whatsapp, service_type, notes, timezone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      [formatISO(utcStartDate), title, name, email, phone, whatsapp || phone, service, message, timezone],
    )

    return NextResponse.json({ id: result.rows[0].id }, { status: 201 })
  } catch (error) {
    console.error("Database query error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

