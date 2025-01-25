import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(request) {
  const protectedPaths = ["/api/admin-change-password"]
  const path = request.nextUrl.pathname

  // Allow all requests to /api/admin-reset-password to pass through
  if (path === "/api/admin-reset-password") {
    return NextResponse.next()
  }

  if (protectedPaths.includes(path)) {
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
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}

