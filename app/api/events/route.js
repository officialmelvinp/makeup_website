import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    const result = await db.query("SELECT * FROM events ORDER BY start DESC")
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error("Database query error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { start, title, name, email, phone, whatsapp, service, message } = await request.json()
    console.log("Received booking request:", { start, title, name, email, phone, whatsapp, service, message })

    const result = await db.query(
      "INSERT INTO events (start, title, client_name, client_email, client_phone, client_whatsapp, service_type, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [start, title, name, email, phone, whatsapp || phone, service, message],
    )

    console.log("Database insert result:", result.rows[0])

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Database query error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json()
    console.log("Received delete request for event id:", id)

    const result = await db.query("DELETE FROM events WHERE id = $1 RETURNING *", [id])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    console.log("Database delete result:", result.rows[0])

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Database query error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

