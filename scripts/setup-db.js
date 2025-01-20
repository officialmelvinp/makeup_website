const { Pool } = require("pg")
require("dotenv").config({ path: ".env.local" })

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
    port: Number.parseInt(process.env.DB_PORT, 10),
  })

  try {
    console.log("Attempting to connect to the database...")
    const client = await pool.connect()
    console.log("Successfully connected to the database")

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
        notes TEXT
      )
    `)

    // Check if the client_whatsapp column exists, if not, add it
    const checkColumnExists = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'events' AND column_name = 'client_whatsapp'
    `)

    if (checkColumnExists.rows.length === 0) {
      await client.query(`
        ALTER TABLE events
        ADD COLUMN client_whatsapp VARCHAR(50)
      `)
      console.log("Added client_whatsapp column to events table")
    }

    console.log("Database setup completed successfully")

    client.release()
  } catch (error) {
    console.error("Error setting up database:", error)
    console.error("Error details:", error.stack)
  } finally {
    await pool.end()
    process.exit()
  }
}

setupDatabase()

