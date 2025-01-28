import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request) {
  console.log("Login attempt received")
  const { email, password } = await request.json()

  console.log("Login attempt:", { email, password: "********" })

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.log("Login failed:", error.message)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    console.log("Login successful")
    return NextResponse.json({ success: true, session: data.session })
  } catch (error) {
    console.error("Error during authentication:", error)
    return NextResponse.json({ message: "An error occurred during authentication" }, { status: 500 })
  }
}

export async function GET(request) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }

  return NextResponse.json({ valid: true })
}

