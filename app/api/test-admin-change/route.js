import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()
    console.log("Received body:", body)
    return NextResponse.json({ message: "Test route is working", receivedData: body })
  } catch (error) {
    console.error("Error in test route:", error)
    return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 })
  }
}

