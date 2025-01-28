import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to get admin user
export async function getAdminUser(email) {
  const { data, error } = await supabase.from("admin_users").select("*").eq("email", email).single()

  if (error) {
    if (error.code === "PGRST116") {
      // No user found
      return null
    }
    throw error
  }
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
export async function updateAdminPassword(email, newPasswordHash) {
  const { error } = await supabase.from("admin_users").update({ password: newPasswordHash }).eq("email", email)

  if (error) throw error
}

// Helper function to fetch contact messages
export async function getContactMessages() {
  const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })

  if (error) throw error
  return data
}

