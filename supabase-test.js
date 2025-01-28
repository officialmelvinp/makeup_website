import dotenv from "dotenv"
import { createClient } from "@supabase/supabase-js"

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runTests() {
  try {
    // Test connection
    console.log("Testing connection...")
    const { data, error } = await supabase.from("events").select("count").single()
    if (error) throw error
    console.log("Connection successful")

    // Test insert
    console.log("\nTesting insert...")
    const { data: insertData, error: insertError } = await supabase
      .from("events")
      .insert({
        start: new Date().toISOString(),
        title: "Test Event",
        client_name: "Test Client",
        client_email: "test@example.com",
        client_phone: "1234567890",
        service_type: "Test Service",
        timezone: "UTC",
      })
      .select()
    if (insertError) throw insertError
    const insertedId = insertData[0].id
    console.log(`Insert successful. ID: ${insertedId}`)

    // Test read
    console.log("\nTesting read...")
    const { data: readData, error: readError } = await supabase.from("events").select("*").eq("id", insertedId).single()
    if (readError) throw readError
    console.log(`Read successful. Title: ${readData.title}`)

    // Test update
    console.log("\nTesting update...")
    const { data: updateData, error: updateError } = await supabase
      .from("events")
      .update({ title: "Updated Test Event" })
      .eq("id", insertedId)
      .select()
    if (updateError) throw updateError
    console.log(`Update successful. New title: ${updateData[0].title}`)

    // Test delete
    console.log("\nTesting delete...")
    const { error: deleteError } = await supabase.from("events").delete().eq("id", insertedId)
    if (deleteError) throw deleteError
    console.log("Delete successful")

    console.log("\nAll tests passed successfully!")
  } catch (err) {
    console.error("Test failed:", err.message)
  }
}

runTests()

