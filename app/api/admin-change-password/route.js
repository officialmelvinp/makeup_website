import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { updateAdminPassword, supabase, getAdminUser } from "@/lib/supabase"
import { jwtVerify } from "jose"

export async function POST(request) {
  try {
    // Verify JWT token
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

    // Fetch admin user using the email from the JWT
    const adminUser = await getAdminUser(adminEmail)

    if (!adminUser) {
      console.error("Admin user not found for email:", adminEmail)
      return NextResponse.json({ message: "Admin user not found" }, { status: 404 })
    }

    console.log("Verifying current password for admin:", adminEmail)
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, adminUser.password)

    if (!isCurrentPasswordValid) {
      console.log("Current password is incorrect for admin:", adminEmail)
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
    }

    console.log("Hashing new password for admin:", adminEmail)
    const newPasswordHash = await bcrypt.hash(newPassword, 10)

    console.log("Updating password in database for admin:", adminEmail)
    await updateAdminPassword(adminEmail, newPasswordHash)

    // Update Supabase Auth is not needed if we're not using Supabase Auth for admin users
    // If you decide to use Supabase Auth in the future, uncomment the following:
    /*
    console.log("Updating Supabase Auth password for admin:", adminEmail)
    const { error: authError } = await supabase.auth.updateUser({ password: newPassword })
    if (authError) {
      console.error("Error updating Supabase Auth password:", authError)
      throw authError
    }
    */

    console.log("Password changed successfully for admin:", adminEmail)
    return NextResponse.json({ message: "Admin password changed successfully" })
  } catch (error) {
    console.error("Error in password change:", error)
    return NextResponse.json({ message: "An error occurred while changing the password" }, { status: 500 })
  }
}

