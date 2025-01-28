import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getAdminUser } from "@/lib/supabase"

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    console.log("Login attempt for email:", email)

    const adminUser = await getAdminUser(email)

    if (!adminUser) {
      console.log("User not found:", email)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    console.log("Retrieved user:", { ...adminUser, password: "[REDACTED]" })

    const isPasswordValid = await bcrypt.compare(password, adminUser.password)
    console.log("Password valid:", isPasswordValid)

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const token = jwt.sign({ email: adminUser.email }, process.env.NEXTAUTH_SECRET, { expiresIn: "1h" })
    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error in admin login:", error)
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 })
  }
}

