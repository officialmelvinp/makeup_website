"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { FaWhatsapp } from "react-icons/fa"
import { parseISO, format } from "date-fns"

const localizer = momentLocalizer(moment)

export default function Contact() {
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

  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("/api/events")
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }
      const data = await response.json()
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
      // 48 half-hour slots in a day
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

    // Get the user's timezone
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

    // Create the appointment date in the user's local time
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
      whatsapp: formData.whatsapp,
      service: formData.service,
      message: formData.message,
      timezone: userTimeZone, // Add the user's timezone to the event data
    }

    try {
      const response = await fetch("/api/events", {
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

      const result = await response.json()
      setSubmitStatus({ type: "success", message: "Booking successful!" })
      setBookingConfirmed(true)
      setBookingId(result.id)
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

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-12 text-plum-800 font-playfair">Book an Appointment</h1>
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={handleSelectSlot}
          selectable
          className="p-4"
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
        <div className="max-w-md mx-auto mt-12 bg-champagne-100 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-plum-700 font-playfair">
            Book for {moment(selectedDate).format("MMMM Do YYYY")}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="time" className="block mb-2 text-sm font-medium text-charcoal-600">
                Select Time
              </label>
              <select
                id="time"
                name="time"
                value={selectedTime}
                onChange={handleTimeChange}
                className="bg-white border border-gray-300 text-charcoal-600 text-sm rounded-lg focus:ring-rose-gold focus:border-rose-gold block w-full p-2.5"
                required
              >
                <option value="">Select a time</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-charcoal-600">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-white border border-gray-300 text-charcoal-600 text-sm rounded-lg focus:ring-rose-gold focus:border-rose-gold block w-full p-2.5"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-charcoal-600">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-white border border-gray-300 text-charcoal-600 text-sm rounded-lg focus:ring-rose-gold focus:border-rose-gold block w-full p-2.5"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium text-charcoal-600">
                Your Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-white border border-gray-300 text-charcoal-600 text-sm rounded-lg focus:ring-rose-gold focus:border-rose-gold block w-full p-2.5"
                required
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block mb-2 text-sm font-medium text-charcoal-600">
                Your WhatsApp Number (if different from phone)
              </label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="bg-white border border-gray-300 text-charcoal-600 text-sm rounded-lg focus:ring-rose-gold focus:border-rose-gold block w-full p-2.5"
              />
            </div>
            <div>
              <label htmlFor="service" className="block mb-2 text-sm font-medium text-charcoal-600">
                Service
              </label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="bg-white border border-gray-300 text-charcoal-600 text-sm rounded-lg focus:ring-rose-gold focus:border-rose-gold block w-full p-2.5"
                required
              >
                <option value="">Select a service</option>
                <option value="Bridal Makeup">Bridal Makeup</option>
                <option value="Special Event Makeup">Special Event Makeup</option>
                <option value="Photoshoot Makeup">Photoshoot Makeup</option>
                <option value="Makeup Lesson">Makeup Lesson</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-charcoal-600">
                Additional Information
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="4"
                className="bg-white border border-gray-300 text-charcoal-600 text-sm rounded-lg focus:ring-rose-gold focus:border-rose-gold block w-full p-2.5"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-rose-gold hover:bg-rose-gold-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              Book Appointment
            </button>
          </form>
        </div>
      )}
      {bookingConfirmed && (
        <div className="mt-8 p-6 bg-champagne-100 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-plum-700">Booking Confirmed!</h2>
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
            className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors text-lg"
          >
            <FaWhatsapp className="mr-2" />
            Contact Us on WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}

