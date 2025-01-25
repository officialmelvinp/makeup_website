import pkg from "pg"
const { Pool } = pkg
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import bcrypt from "bcryptjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env
dotenv.config({ path: join(__dirname, "..", ".env") })

async function setupDatabase() {
  console.log("Attempting to connect to database with these details:")
  console.log(`Host: ${process.env.DB_HOST}`)
  console.log(`Port: ${process.env.DB_PORT}`)
  console.log(`Database: ${process.env.DB_NAME}`)
  console.log(`User: ${process.env.DB_USER}`)

  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number.parseInt(process.env.DB_PORT || "5433", 10),
  })

  try {
    console.log("Attempting to connect to the database...")
    const client = await pool.connect()
    console.log("Successfully connected to the database")

    // Create events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        start TIMESTAMP NOT NULL,
        title VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_email VARCHAR(255) NOT NULL,
        client_phone VARCHAR(50) NOT NULL,
        client_whatsapp VARCHAR(50),
        service_type VARCHAR(100) NOT NULL,
        notes TEXT,
        timezone VARCHAR(255)
      )
    `)

    // Create admin_users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        reset_token VARCHAR(255),
        reset_token_expiry TIMESTAMP
      )
    `)

    // Check if admin user exists, if not create one
    const adminCheck = await client.query("SELECT * FROM admin_users WHERE username = $1", [
      process.env.NEXT_PUBLIC_ADMIN_USERNAME,
    ])
    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
      await client.query("INSERT INTO admin_users (username, password) VALUES ($1, $2)", [
        process.env.NEXT_PUBLIC_ADMIN_USERNAME,
        hashedPassword,
      ])
      console.log("Admin user created")
    } else {
      console.log("Admin user already exists")
    }

    console.log("Database setup completed successfully")

    client.release()
  } catch (error) {
    console.error("Error setting up database:", error)
    console.error("Error details:", error.stack)
  } finally {
    await pool.end()
  }
}

setupDatabase()

