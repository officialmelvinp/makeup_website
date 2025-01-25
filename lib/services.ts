import db from "./db"

export async function searchContent(searchQuery: string) {
  const services = await db.query("SELECT * FROM services WHERE title ILIKE $1 OR description ILIKE $1", [
    `%${searchQuery}%`,
  ])

  const images = await db.query("SELECT * FROM gallery WHERE alt ILIKE $1 OR category ILIKE $1", [`%${searchQuery}%`])

  return {
    services: services.rows,
    images: images.rows,
  }
}

