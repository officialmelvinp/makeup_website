import pkg from "pg"
const { Pool } = pkg
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

async function testConnection() {
  console.log("Testing database connection...")
  console.log(`Host: ${process.env.DB_HOST}`)
  console.log(`Port: ${process.env.DB_PORT}`)
  console.log(`Database: ${process.env.DB_NAME}`)
  console.log(`User: ${process.env.DB_USER}`)

  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number.parseInt(process.env.DB_PORT || "5432", 10),
  })

  try {
    const client = await pool.connect()
    const result = await client.query("SELECT NOW()")
    console.log("Successfully connected to the database")
    console.log("Current time from database:", result.rows[0].now)
    client.release()
  } catch (error) {
    console.error("Error connecting to the database:", error)
    console.error("Error details:", error.stack)
  } finally {
    await pool.end()
  }
}

testConnection()

