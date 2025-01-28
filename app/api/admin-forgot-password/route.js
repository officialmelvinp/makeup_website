import { NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { supabase } from "@/lib/supabase"
import { sendEmail } from "@/lib/mail"

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (email !== process.env.EMAIL_HOST_USER) {
      return NextResponse.json({
        message: "If an account exists with this email, a password reset link has been sent.",
      })
    }

    const resetToken = randomBytes(20).toString("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    const { error } = await supabase
      .from("admin_users")
      .update({ reset_token: resetToken, reset_token_expiry: resetTokenExpiry })
      .eq("email", email)

    if (error) throw error

    const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${resetToken}`

    await sendEmail({
      to: email,
      subject: "Reset Your Admin Password",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`,
    })

    return NextResponse.json({ message: "If an account exists with this email, a password reset link has been sent." })
  } catch (error) {
    console.error("Error in forgot password:", error)
    return NextResponse.json({ message: "An error occurred. Please try again later." }, { status: 500 })
  }
}

