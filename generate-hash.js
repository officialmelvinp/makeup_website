import bcrypt from "bcryptjs"

const password = "Afolasade01@"
const saltRounds = 10

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error generating hash:", err)
  } else {
    console.log("Generated hash:", hash)
    console.log("Use this hash in your .env.local file for ADMIN_PASSWORD")
  }
})

