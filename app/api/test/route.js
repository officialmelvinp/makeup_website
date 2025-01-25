import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "Test API is working" })
}

export async function POST(request) {
  try {
    const body = await request.json()
    return NextResponse.json({ message: "Received data", data: body })
  } catch (error) {
    console.error("Error in test route:", error)
    return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 })
  }
}

