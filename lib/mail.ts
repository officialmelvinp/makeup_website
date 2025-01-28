import nodemailer from "nodemailer"

interface EmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({
  to,
  subject,
  html,
}: EmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  // Add debug logging for configuration
  console.log("Email configuration:", {
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT || "465"),
    secure: true, // Force SSL
    auth: {
      user: process.env.EMAIL_HOST_USER,
    },
  })

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465, // Hardcode the port since we know it's 465
    secure: true, // Force SSL since port is 465
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD,
    },
    tls: {
      // Add TLS options
      rejectUnauthorized: false, // Allow self-signed certificates
      minVersion: "TLSv1.2",
    },
    debug: true, // Enable debug logging
  })

  try {
    // Verify connection configuration
    await transporter.verify()
    console.log("SMTP connection verified successfully")

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    })
    console.log("Email sent successfully:", info)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Detailed error sending email:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

