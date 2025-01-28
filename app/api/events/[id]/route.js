import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function DELETE(request, { params }) {
  try {
    const { id } = params

    const { error, data } = await supabase.from("events").delete().eq("id", id)

    if (error) throw error

    if (data.length === 0) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Database query error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

