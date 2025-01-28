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
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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

  const handleSelectSlot = useCallback(
    (slotInfo) => {
      const selectedDate = moment(slotInfo.start).format("YYYY-MM-DD")
      router.push(`/booking/time?date=${selectedDate}`)
    },
    [router],
  )

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0]
        const target = document.elementFromPoint(touch.clientX, touch.clientY)
        if (target && target.classList.contains("rbc-date-cell")) {
          const date = target.getAttribute("data-date")
          if (date) {
            router.push(`/booking/time?date=${date}`)
          }
        }
      }
    }

    const calendarElement = document.querySelector(".mobile-friendly-calendar")
    if (calendarElement) {
      calendarElement.addEventListener("touchstart", handleTouchStart)
    }

    return () => {
      if (calendarElement) {
        calendarElement.removeEventListener("touchstart", handleTouchStart)
      }
    }
  }, [router])

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
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 text-plum-800 font-playfair">
        Book an Appointment
      </h1>
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: isMobile ? 400 : 500 }}
          onSelectSlot={handleSelectSlot}
          selectable={true}
          longPressThreshold={50}
          className="p-2 sm:p-4 mobile-friendly-calendar"
          views={isMobile ? { month: true } : { month: true, week: true, day: true }}
          defaultView={Views.MONTH}
          date={currentDate}
          onNavigate={handleNavigate}
          tooltipAccessor={(event) => event.title}
          components={{
            toolbar: CustomToolbar,
          }}
          formats={{
            dateFormat: "D",
            dayFormat: (date, culture, localizer) => localizer.format(date, "ddd", culture),
          }}
          messages={{
            today: "Today",
            previous: "Back",
            next: "Next",
          }}
          popup
          drilldownView={isMobile ? null : Views.DAY}
        />
      </div>
    </div>
  )
}

