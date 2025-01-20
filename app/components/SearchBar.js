"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          placeholder="Search services, gallery images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-full border-2 border-rose-gold focus:outline-none focus:border-rose-gold-600 text-plum-800"
        />
        <button
          type="submit"
          className="absolute right-0 top-0 mt-2 mr-2 bg-rose-gold text-white px-4 py-1 rounded-full hover:bg-rose-gold-600 transition duration-300"
        >
          Search
        </button>
      </div>
    </form>
  )
}

