import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabase } from "@/lib/supabase"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("reset_token", token)
      .gt("reset_token_expiry", new Date().toISOString())
      .single()

    if (error || !data) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 })
    }

    return NextResponse.json({ message: "Token is valid" })
  } catch (error) {
    console.error("Error verifying reset token:", error)
    return NextResponse.json({ message: "Failed to verify token" }, { status: 500 })
  }
}

export async function POST(request) {
  const { token, password } = await request.json()

  if (!token || !password) {
    return NextResponse.json({ message: "Token and password are required" }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("reset_token", token)
      .gt("reset_token_expiry", new Date().toISOString())
      .single()

    if (error || !data) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { error: updateError } = await supabase
      .from("admin_users")
      .update({
        password: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
      })
      .eq("id", data.id)

    if (updateError) throw updateError

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Error resetting password:", error)
    return NextResponse.json({ message: "Failed to reset password" }, { status: 500 })
  }
}

