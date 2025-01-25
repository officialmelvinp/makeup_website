import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { config } from "../../../config.js"

const JWT_SECRET = config.NEXTAUTH_SECRET

export async function POST(request) {
  console.log("Login attempt received")
  const { username, password } = await request.json()

  console.log("Login attempt:", { username, password: "********" })

  if (username !== config.NEXT_PUBLIC_ADMIN_USERNAME) {
    console.log("Invalid username")
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
  }

  const storedPasswordHash = config.ADMIN_PASSWORD
  if (!storedPasswordHash) {
    console.error("ADMIN_PASSWORD is not set in environment variables")
    return NextResponse.json({ message: "Server configuration error" }, { status: 500 })
  }

  try {
    console.log("Attempting to compare passwords")
    console.log("Stored password hash:", storedPasswordHash)
    const isPasswordValid = await bcrypt.compare(password, storedPasswordHash)
    console.log("Password validation result:", isPasswordValid)

    if (isPasswordValid) {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" })
      console.log("Login successful, token generated")
      return NextResponse.json({ success: true, token })
    } else {
      console.log("Invalid password")
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Error during password comparison:", error)
    return NextResponse.json({ message: "An error occurred during authentication" }, { status: 500 })
  }
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 })
  }

  const token = authHeader.split(" ")[1]
  try {
    jwt.verify(token, JWT_SECRET)
    return NextResponse.json({ valid: true })
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
}

