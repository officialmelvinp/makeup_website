"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./calendar-styles.css"
import { FaWhatsapp } from "react-icons/fa"
import { parseISO } from "date-fns"
import { supabase } from "@/lib/supabase"
import { ChevronLeft, ChevronRight } from "lucide-react"

const localizer = momentLocalizer(moment)

export default function Booking() {
  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState("")
  const [availableTimes, setAvailableTimes] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    service: "",
    message: "",
  })
  const [submitStatus, setSubmitStatus] = useState(null)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookingId, setBookingId] = useState(null)
  const [currentDate, setCurrentDate] = useState(new Date())

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
    setSelectedDate(slotInfo.start)
    setShowForm(true)
    setSelectedTime("")
    setSubmitStatus(null)
    generateAvailableTimes(slotInfo.start)
  }

  const generateAvailableTimes = (date) => {
    const startOfDay = moment(date).startOf("day")
    const endOfDay = moment(date).endOf("day")
    const timeSlots = []

    for (let i = 0; i < 48; i++) {
      const currentTime = moment(startOfDay).add(i * 30, "minutes")
      const timeString = currentTime.format("HH:mm")

      const isBooked = events.some((event) => {
        const eventStart = moment(event.start)
        const eventEnd = moment(event.end)
        return currentTime.isBetween(eventStart, eventEnd, null, "[)")
      })

      if (!isBooked) {
        timeSlots.push(timeString)
      }

      if (currentTime.isSame(endOfDay)) break
    }

    setAvailableTimes(timeSlots)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus(null)

    if (!selectedTime) {
      setSubmitStatus({ type: "error", message: "Please select a time for your appointment." })
      return
    }

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    const localAppointmentDateTime = moment(selectedDate)
      .set({
        hour: Number.parseInt(selectedTime.split(":")[0], 10),
        minute: Number.parseInt(selectedTime.split(":")[1], 10),
        second: 0,
        millisecond: 0,
      })
      .toDate()

    const eventData = {
      start: localAppointmentDateTime.toISOString(),
      title: `Booked - ${formData.service}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      service: formData.service,
      message: formData.message,
      timezone: userTimeZone,
    }

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Booking failed")
      }

      const data = await response.json()

      setSubmitStatus({ type: "success", message: "Booking successful!" })
      setBookingConfirmed(true)
      setBookingId(data.booking.id)
      fetchEvents()
      setShowForm(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        whatsapp: "",
        service: "",
        message: "",
      })
      setSelectedTime("")
    } catch (error) {
      console.error("Error submitting booking:", error)
      setSubmitStatus({ type: "error", message: error.message || "Booking failed. Please try again." })
    }
  }

  const CustomToolbar = ({ date, onNavigate, label }) => {
    const goToBack = () => {
      onNavigate("PREV")
    }

    const goToNext = () => {
      onNavigate("NEXT")
    }

    const goToCurrent = () => {
      onNavigate("TODAY")
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
      {submitStatus && (
        <div
          className={`mt-4 p-2 rounded ${
            submitStatus.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {submitStatus.message}
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-plum-700 font-playfair">
              Book for {moment(selectedDate).format("MMMM Do YYYY")}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-gold focus:border-rose-gold"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Your Email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-gold focus:border-rose-gold"
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Your Phone Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-gold focus:border-rose-gold"
                required
              />
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                placeholder="Your WhatsApp Number (Optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-gold focus:border-rose-gold"
              />
              <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-gold focus:border-rose-gold"
                required
              >
                <option value="">Select Service</option>
                <option value="Bridal Makeup">Bridal Makeup</option>
                <option value="Special Event Makeup">Special Event Makeup</option>
                <option value="Photoshoot Makeup">Photoshoot Makeup</option>
                <option value="Makeup Lesson">Makeup Lesson</option>
              </select>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Any additional requests or information"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-gold focus:border-rose-gold"
              ></textarea>
              <select
                name="selectedTime"
                value={selectedTime}
                onChange={handleTimeChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-rose-gold focus:border-rose-gold"
                required
              >
                <option value="">Select Time</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-gold hover:bg-rose-gold-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Book Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {bookingConfirmed && (
        <div className="mt-8 p-4 sm:p-6 bg-champagne-100 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-plum-700">Booking Confirmed!</h2>
          <p className="mb-4">
            Thank you for booking with us. We&apos;ll be in touch soon to confirm your appointment.
          </p>
          <p className="mb-6">
            If you have any questions or need to make changes, please don&apos;t hesitate to contact us.
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP}?text=Hello, I've just booked an appointment (ID: ${bookingId}). I have a question about my booking.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-green-600 transition-colors text-base sm:text-lg"
          >
            <FaWhatsapp className="mr-2" />
            Contact Us on WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}

