import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, ".env") })

const password = "Afolasade01@" // Replace this with the actual password you're using
const storedHash = process.env.ADMIN_PASSWORD

console.log("Environment variables:")
console.log("NEXT_PUBLIC_ADMIN_USERNAME:", process.env.NEXT_PUBLIC_ADMIN_USERNAME)
console.log("ADMIN_PASSWORD set:", !!process.env.ADMIN_PASSWORD)
console.log("NEXTAUTH_SECRET set:", !!process.env.NEXTAUTH_SECRET)

console.log("Stored hash:", storedHash)

if (storedHash) {
  bcrypt.compare(password, storedHash, (err, result) => {
    if (err) {
      console.error("Error comparing password:", err)
    } else {
      console.log("Password is valid:", result)
    }
  })
} else {
  console.error("ADMIN_PASSWORD is not set in environment variables")
}

