import { supabase } from "./supabase"

export async function searchServices(query) {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order("title")

  if (error) {
    console.error("Error searching services:", error)
    return []
  }

  return data
}

export async function searchGallery(query) {
  const { data, error } = await supabase.from("gallery").select("*").ilike("alt", `%${query}%`).order("alt")

  if (error) {
    console.error("Error searching gallery:", error)
    return []
  }

  return data
}

export async function searchPrices(query) {
  // Remove '£' sign if present and convert to number
  const numericQuery = Number.parseFloat(query.replace("£", "").trim())

  if (isNaN(numericQuery)) {
    // If the query is not a number, search by category or name
    const { data, error } = await supabase
      .from("prices")
      .select("*")
      .or(`category.ilike.%${query}%,name.ilike.%${query}%`)
      .order("category")

    if (error) {
      console.error("Error searching prices:", error)
      return []
    }

    return data
  } else {
    // If the query is a number, search by price
    const { data, error } = await supabase.from("prices").select("*").eq("price", `£${numericQuery}`).order("category")

    if (error) {
      console.error("Error searching prices:", error)
      return []
    }

    return data
  }
}

