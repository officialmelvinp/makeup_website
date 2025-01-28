import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export async function query(text, params) {
  const start = Date.now()
  try {
    const { data, error, count } = await supabase.rpc("custom_query", { query_text: text, query_params: params })
    if (error) throw error
    const duration = Date.now() - start
    console.log("executed query", { text, duration, rows: count })
    return { rows: data, rowCount: count }
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getAdminUser(username) {
  const { data, error } = await supabase.from("admin_users").select("*").eq("username", username).single()

  if (error) throw error
  return data
}

export async function updateAdminPassword(username, newPasswordHash) {
  const { data, error } = await supabase
    .from("admin_users")
    .update({ password: newPasswordHash })
    .eq("username", username)

  if (error) throw error
  return data
}

export async function updateAdminResetToken(username, resetToken, resetTokenExpiry) {
  const { data, error } = await supabase
    .from("admin_users")
    .update({ reset_token: resetToken, reset_token_expiry: resetTokenExpiry })
    .eq("username", username)

  if (error) throw error
  return data
}

export async function clearAdminResetToken(username) {
  const { data, error } = await supabase
    .from("admin_users")
    .update({ reset_token: null, reset_token_expiry: null })
    .eq("username", username)

  if (error) throw error
  return data
}

const db = { query, getAdminUser, updateAdminPassword, updateAdminResetToken, clearAdminResetToken }
export default db

// Export the Supabase client directly
export { supabase }

