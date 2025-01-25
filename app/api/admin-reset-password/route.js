import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { query } from "@/lib/db"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 })
  }

  try {
    const result = await query("SELECT * FROM admin_users WHERE reset_token = $1 AND reset_token_expiry > NOW()", [
      token,
    ])

    if (result.rows.length === 0) {
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

  try {
    const result = await query("SELECT * FROM admin_users WHERE reset_token = $1 AND reset_token_expiry > NOW()", [
      token,
    ])

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 })
    }

    const adminUser = result.rows[0]
    const hashedPassword = await bcrypt.hash(password, 10)

    await query("UPDATE admin_users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2", [
      hashedPassword,
      adminUser.id,
    ])

    return NextResponse.json({ message: "Password reset successfully" })
  } catch (error) {
    console.error("Error resetting password:", error)
    return NextResponse.json({ message: "Failed to reset password" }, { status: 500 })
  }
}

