import { sendEmail } from "@/lib/mail"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    await sendEmail({
      to: process.env.EMAIL_HOST_USER || "",
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in contact route:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}

