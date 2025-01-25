import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number.parseInt(process.env.DB_PORT || "5432"),
})

export async function query(text, params) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("executed query", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export async function getAdminUser(username) {
  const result = await query("SELECT * FROM admin_users WHERE username = $1", [username])
  return result.rows[0]
}

export async function updateAdminPassword(username, newPasswordHash) {
  return query("UPDATE admin_users SET password = $1 WHERE username = $2", [newPasswordHash, username])
}

export async function updateAdminResetToken(username, resetToken, resetTokenExpiry) {
  return query("UPDATE admin_users SET reset_token = $1, reset_token_expiry = $2 WHERE username = $3", [
    resetToken,
    resetTokenExpiry,
    username,
  ])
}

export async function clearAdminResetToken(username) {
  return query("UPDATE admin_users SET reset_token = NULL, reset_token_expiry = NULL WHERE username = $1", [username])
}

const db = { query, getAdminUser, updateAdminPassword, updateAdminResetToken, clearAdminResetToken }
export default db

