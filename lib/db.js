const { Pool } = require("pg")
require("dotenv").config({ path: ".env.local" })

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number.parseInt(process.env.DB_PORT, 10),
})

if (process.env.NODE_ENV === "development") {
  console.log("DB Connection Details:")
  console.log(`Host: ${process.env.DB_HOST}`)
  console.log(`Port: ${process.env.DB_PORT}`)
  console.log(`Database: ${process.env.DB_NAME}`)
  console.log(`User: ${process.env.DB_USER}`)
}

module.exports = {
  query: (text, params) => pool.query(text, params),
}

