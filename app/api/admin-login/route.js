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
    console.log("Stored hashed password:", adminUser.password)

    console.log("Attempting to compare provided password with stored hash")
    const isPasswordValid = await bcrypt.compare(password, adminUser.password)
    console.log("Password comparison result:", isPasswordValid)

    if (!isPasswordValid) {
      console.log("Password invalid for user:", email)
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const token = jwt.sign({ email: adminUser.email }, process.env.NEXTAUTH_SECRET, { expiresIn: "1h" })
    console.log("Login successful for user:", email)
    return NextResponse.json({ token })
  } catch (error) {
    console.error("Error in admin login:", error)
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 })
  }
}

