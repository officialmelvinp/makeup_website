import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const result = await db.query("DELETE FROM events WHERE id = $1", [id])

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Database query error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

