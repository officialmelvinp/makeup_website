import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getAdminUser(email) {
  console.log("Fetching admin user for email:", email)
  const { data, error } = await supabase.from("admin_users").select("*").eq("email", email).single()

  if (error) {
    if (error.code === "PGRST116") {
      console.log("No user found for email:", email)
      return null
    }
    console.error("Error fetching admin user:", error)
    throw error
  }

  if (!data) {
    console.log("No user data returned for email:", email)
    return null
  }

  console.log("Admin user found:", { ...data, password: "[REDACTED]" })
  console.log("Hashed password from database:", data.password)
  return data
}

// Helper function to update admin reset token
export async function updateAdminResetToken(email, resetToken, resetTokenExpiry) {
  const { error } = await supabase
    .from("admin_users")
    .update({ reset_token: resetToken, reset_token_expiry: resetTokenExpiry })
    .eq("email", email)

  if (error) throw error
}

// Helper function to update admin password
export async function updateAdminPassword(email, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  const { error } = await supabase.from("admin_users").update({ password: hashedPassword }).eq("email", email)

  if (error) {
    console.error("Error updating password:", error)
    throw error
  }

  console.log("Password updated successfully for email:", email)
  return { success: true }
}

// Helper function to fetch contact messages
export async function getContactMessages() {
  const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// New helper function to verify password
export async function verifyPassword(plainTextPassword, hashedPassword) {
  return bcrypt.compare(plainTextPassword, hashedPassword)
}

