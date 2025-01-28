import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { updateAdminPassword, supabase } from "@/lib/supabase"
import { jwtVerify } from "jose"

export async function POST(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    try {
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
      await jwtVerify(token, secret)
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const { data: adminUser, error: fetchError } = await supabase
      .from("admin_users")
      .select("password")
      .eq("username", process.env.NEXT_PUBLIC_ADMIN_USERNAME)
      .single()

    if (fetchError || !adminUser) {
      return NextResponse.json({ message: "Admin user not found" }, { status: 404 })
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, adminUser.password)

    if (!isCurrentPasswordValid) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 })
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 10)
    await updateAdminPassword(process.env.NEXT_PUBLIC_ADMIN_USERNAME, newPasswordHash)

    // Update Supabase Auth
    const { error: authError } = await supabase.auth.updateUser({ password: newPassword })

    if (authError) {
      throw authError
    }

    return NextResponse.json({ message: "Admin password changed successfully" })
  } catch (error) {
    console.error("Error in password change:", error)
    return NextResponse.json({ message: "An error occurred while changing the password" }, { status: 500 })
  }
}

