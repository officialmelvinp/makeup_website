import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { updateAdminPassword, getAdminUser } from "@/lib/supabase"
import { jwtVerify } from "jose"

export async function POST(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
      const { payload } = await jwtVerify(token, secret)
      var adminEmail = payload.email
    } catch (error) {
      console.error("Token verification error:", error)
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const adminUser = await getAdminUser(adminEmail)

    if (!adminUser) {
      console.error("Admin user not found for email:", adminEmail)
      return NextResponse.json({ message: "Admin user not found" }, { status: 404 })
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, adminUser.password)

    if (!isCurrentPasswordValid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10)
    await updateAdminPassword(adminEmail, newPasswordHash)

    return NextResponse.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Error in password change:", error)
    return NextResponse.json({ message: "An error occurred while changing the password" }, { status: 500 })
  }
}

