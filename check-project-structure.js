import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function checkProjectStructure(dir, level = 0) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stats = fs.statSync(filePath)
    const isDirectory = stats.isDirectory()
    const indent = "  ".repeat(level)

    if (isDirectory) {
      console.log(`${indent}📁 ${file}`)
      if (!["node_modules", ".git", ".next"].includes(file)) {
        checkProjectStructure(filePath, level + 1)
      }
    } else {
      console.log(`${indent}📄 ${file}`)
    }
  })
}

console.log("Project Structure:")
checkProjectStructure(path.resolve(__dirname, "."))

console.log("\nReminder: Do not upload node_modules, .git, .env files, and other development-specific files to cPanel.")

