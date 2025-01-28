"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import moment from "moment"

export default function TimeSelectionContent() {
  const [availableTimes, setAvailableTimes] = useState([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const date = searchParams.get("date")

  useEffect(() => {
    if (date) {
      generateAvailableTimes(new Date(date))
    }
  }, [date])

  const generateAvailableTimes = async (date) => {
    const startOfDay = moment(date).startOf("day")
    const endOfDay = moment(date).endOf("day")
    const timeSlots = []

    // Fetch booked events for the selected date
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .gte("start", startOfDay.toISOString())
      .lt("start", endOfDay.toISOString())

    if (error) {
      console.error("Error fetching events:", error)
      return
    }

    for (let i = 0; i < 48; i++) {
      const currentTime = moment(startOfDay).add(i * 30, "minutes")
      const timeString = currentTime.format("HH:mm")

      const isBooked = events.some((event) => {
        const eventStart = moment(event.start)
        const eventEnd = moment(event.end || eventStart).add(2, "hours")
        return currentTime.isBetween(eventStart, eventEnd, null, "[)")
      })

      if (!isBooked) {
        timeSlots.push(timeString)
      }

      if (currentTime.isSame(endOfDay)) break
    }

    setAvailableTimes(timeSlots)
  }

  const handleTimeSelect = (time) => {
    router.push(`/booking/form?date=${date}&time=${time}`)
  }

  return (
    <>
      <p className="text-lg mb-4 text-center">Available times for {moment(date).format("MMMM D, YYYY")}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {availableTimes.map((time) => (
          <button
            key={time}
            onClick={() => handleTimeSelect(time)}
            className="p-3 bg-rose-gold text-white rounded-md hover:bg-rose-gold-dark transition-colors duration-300"
          >
            {time}
          </button>
        ))}
      </div>
      {availableTimes.length === 0 && (
        <p className="text-center text-gray-600 mt-4">No available times for this date. Please select another date.</p>
      )}
    </>
  )
}

