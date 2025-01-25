import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const result = dotenv.config({ path: join(__dirname, ".env") })

if (result.error) {
  console.log("Error loading .env file:", result.error)
} else {
  console.log(".env file loaded successfully")
}

const envVars = [
  "NEXT_PUBLIC_ADMIN_USERNAME",
  "ADMIN_PASSWORD",
  "NEXTAUTH_SECRET",
  "DB_USER",
  "DB_PASSWORD",
  "DB_HOST",
  "DB_PORT",
  "DB_NAME",
  "NEXT_PUBLIC_ALLOWED_HOSTS",
  "EMAIL_HOST_USER",
  "SMTP_FROM",
  "EMAIL_USE_SSL",
  "NEXT_PUBLIC_BUSINESS_WHATSAPP",
  "EMAIL_HOST",
  "EMAIL_HOST_PASSWORD",
  "EMAIL_PORT",
  "NEXTAUTH_URL",
]

envVars.forEach((varName) => {
  console.log(`${varName}:`, process.env[varName] ? "Set" : "Not set")
})

