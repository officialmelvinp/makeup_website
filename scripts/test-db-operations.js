import pkg from "pg"
const { Pool } = pkg
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number.parseInt(process.env.DB_PORT || "5433", 10),
})

async function testDatabaseOperations() {
  const client = await pool.connect()
  try {
    // Insert a test event
    const insertResult = await client.query(
      "INSERT INTO events (start, title, client_name, client_email, client_phone, client_whatsapp, service_type, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id",
      [
        new Date(),
        "Test Event",
        "Test Client",
        "test@example.com",
        "1234567890",
        "0987654321",
        "Test Service",
        "Test Notes",
      ],
    )
    console.log("Inserted test event with ID:", insertResult.rows[0].id)

    // Retrieve all events
    const selectResult = await client.query("SELECT * FROM events")
    console.log("All events in the database:")
    console.log(selectResult.rows)

    // Delete the test event
    await client.query("DELETE FROM events WHERE title = $1", ["Test Event"])
    console.log("Deleted test event")
  } catch (error) {
    console.error("Error during database operations:", error)
  } finally {
    client.release()
    await pool.end()
  }
}

testDatabaseOperations()

