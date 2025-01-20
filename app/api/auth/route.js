import { NextResponse } from "next/server"

export async function POST(request) {
  const { username, password } = await request.json()

  if (username === process.env.NEXT_PUBLIC_ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ success: false }, { status: 401 })
  }
}

