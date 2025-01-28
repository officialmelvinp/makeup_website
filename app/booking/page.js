"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./calendar-styles.css"
import { parseISO } from "date-fns"
import { supabase } from "@/lib/supabase"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

const localizer = momentLocalizer(moment)

export default function Booking() {
  const [events, setEvents] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const router = useRouter()

  const fetchEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("events").select("*").order("start", { ascending: true })

      if (error) throw error

      setEvents(
        data.map((event) => ({
          ...event,
          start: parseISO(event.start),
          end: moment(parseISO(event.start)).add(2, "hours").toDate(),
          title: "Booked",
        })),
      )
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const handleSelectSlot = (slotInfo) => {
    router.push(`/booking/time?date=${slotInfo.start.toISOString().split("T")[0]}`)
  }

  const CustomToolbar = ({ date, onNavigate, label }) => {
    const goToBack = () => {
      onNavigate("PREV")
    }

    const goToNext = () => {
      onNavigate("NEXT")
    }

    return (
      <div className="flex items-center justify-between mb-4">
        <button type="button" onClick={goToBack} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-lg font-semibold">{label}</span>
        <button type="button" onClick={goToNext} className="p-2 rounded-full hover:bg-gray-200">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    )
  }

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate)
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 mt-16">
      {" "}
      {/* Added mt-16 for top margin */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 text-plum-800 font-playfair">
        Book an Appointment
      </h1>
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={handleSelectSlot}
          selectable
          className="p-2 sm:p-4"
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={Views.MONTH}
          date={currentDate}
          onNavigate={handleNavigate}
          tooltipAccessor={(event) => event.title}
          components={{
            toolbar: CustomToolbar,
          }}
        />
      </div>
    </div>
  )
}

