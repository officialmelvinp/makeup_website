import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    // Insert the message into the database
    const { data, error } = await supabase.from("contact_messages").insert({ name, email, message }).select()

    if (error) throw error

    return NextResponse.json({ success: true, message: "Message sent successfully" })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ success: false, message: "Failed to send message" }, { status: 500 })
  }
}

