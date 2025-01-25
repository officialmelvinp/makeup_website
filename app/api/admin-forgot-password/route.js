import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { randomBytes } from "crypto"
import { updateAdminResetToken } from "@/lib/db"

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (email !== process.env.EMAIL_HOST_USER) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 })
    }

    const resetToken = randomBytes(20).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    await updateAdminResetToken(process.env.NEXT_PUBLIC_ADMIN_USERNAME, resetToken, resetTokenExpiry)

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number.parseInt(process.env.EMAIL_PORT || "465"),
      secure: process.env.EMAIL_USE_SSL === "True",
      auth: {
        user: process.env.EMAIL_HOST_USER,
        pass: process.env.EMAIL_HOST_PASSWORD,
      },
    })

    const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${resetToken}`

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Reset Your Admin Password",
      text: `Click the following link to reset your password: ${resetUrl}`,
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    })

    return NextResponse.json({ message: "Password reset email sent" })
  } catch (error) {
    console.error("Error in forgot password:", error)
    return NextResponse.json({ message: "Failed to process forgot password request" }, { status: 500 })
  }
}

