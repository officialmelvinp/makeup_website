import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getAdminUser, supabase } from "@/lib/supabase"

export async function POST(request) {
  try {
    const { username, password } = await request.json()
    const adminUser = await getAdminUser(username)

    if (!adminUser) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, adminUser.password)
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminUser.email,
      password: password,
    })

    if (error) {
      throw error
    }

    const token = jwt.sign({ username: adminUser.username }, process.env.NEXTAUTH_SECRET, { expiresIn: "1h" })
    return NextResponse.json({ token, supabaseSession: data.session })
  } catch (error) {
    console.error("Error in admin login:", error)
    return NextResponse.json({ message: "An error occurred during login" }, { status: 500 })
  }
}

