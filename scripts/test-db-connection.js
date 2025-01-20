const { Client } = require("pg")
require("dotenv").config({ path: ".env.local" })

async function testConnection() {
  console.log("Testing database connection...")
  console.log(`Host: ${process.env.DB_HOST}`)
  console.log(`Port: ${process.env.DB_PORT}`)
  console.log(`Database: ${process.env.DB_NAME}`)
  console.log(`User: ${process.env.DB_USER}`)

  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5433, // Hardcode the port to 5433 for now
  })

  try {
    await client.connect()
    const result = await client.query("SELECT NOW()")
    console.log("Successfully connected to the database")
    console.log("Current time from database:", result.rows[0].now)
  } catch (error) {
    console.error("Error connecting to the database:", error)
    console.error("Error details:", error.stack)
  } finally {
    await client.end()
    process.exit()
  }
}

testConnection()

