"use client"

import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { FaWhatsapp } from "react-icons/fa"

const localizer = momentLocalizer(moment)

export default function AdminPage() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [view, setView] = useState("calendar") // 'calendar' or 'list'
  const [selectedEvent, setSelectedEvent] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await response.json()
      if (data.success) {
        setIsAuthenticated(true)
      } else {
        setError("Invalid credentials")
      }
    } catch (err) {
      setError("Login failed")
    }
  }

  const fetchEvents = async () => {
    if (!isAuthenticated) return
    try {
      const response = await fetch("/api/events")
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }
      const data = await response.json()
      setEvents(
        data.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.start),
          title: `${event.service_type} - ${event.client_name}`,
        })),
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [isAuthenticated])

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        const response = await fetch("/api/events", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        })
        if (!response.ok) {
          throw new Error("Failed to delete booking")
        }
        await fetchEvents() // Refresh the events list
        setSelectedEvent(null)
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleEventSelect = (event) => {
    setSelectedEvent(event)
  }

  const generateWhatsAppLink = (phoneNumber, name, date) => {
    const formattedDate = new Date(date).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
    const message = `Hello ${name}, this is a reminder for your makeup appointment on ${formattedDate}. We're looking forward to seeing you! If you need to reschedule, please let us know.`
    return `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button type="submit" className="bg-rose-gold text-white px-4 py-2 rounded">
            Login
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    )
  }

  if (isLoading) return <p className="mt-20">Loading...</p>
  if (error) return <p className="mt-20">Error: {error}</p>

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-4">
        <button
          onClick={() => setView("calendar")}
          className={`mr-2 px-4 py-2 rounded ${view === "calendar" ? "bg-rose-gold text-white" : "bg-gray-200"}`}
        >
          Calendar View
        </button>
        <button
          onClick={() => setView("list")}
          className={`px-4 py-2 rounded ${view === "list" ? "bg-rose-gold text-white" : "bg-gray-200"}`}
        >
          List View
        </button>
      </div>
      {view === "calendar" ? (
        <div className="h-[600px]">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleEventSelect}
            style={{ height: "100%" }}
          />
        </div>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="bg-white shadow rounded-lg p-4">
              <p>
                <strong>Date and Time:</strong> {moment(event.start).format("MMMM Do YYYY, h:mm a")}
              </p>
              <p>
                <strong>Service:</strong> {event.service_type}
              </p>
              <p>
                <strong>Client:</strong> {event.client_name}
              </p>
              <button
                onClick={() => handleEventSelect(event)}
                className="mt-2 bg-rose-gold text-white px-4 py-2 rounded hover:bg-rose-gold-600 transition-colors"
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedEvent.title}</h2>
            <p>
              <strong>Date and Time:</strong> {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm a")}
            </p>
            <p>
              <strong>Client Name:</strong> {selectedEvent.client_name}
            </p>
            <p>
              <strong>Client Email:</strong> {selectedEvent.client_email}
            </p>
            <p>
              <strong>Client Phone:</strong> {selectedEvent.client_phone}
            </p>
            <p>
              <strong>Client WhatsApp:</strong>{" "}
              {selectedEvent.client_whatsapp ? (
                <a
                  href={`https://wa.me/${selectedEvent.client_whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {selectedEvent.client_whatsapp}
                </a>
              ) : (
                "N/A"
              )}
            </p>
            <p>
              <strong>Service:</strong> {selectedEvent.service_type}
            </p>
            <p>
              <strong>Notes:</strong> {selectedEvent.notes || "N/A"}
            </p>
            <div className="mt-4">
              {selectedEvent.client_whatsapp && (
                <a
                  href={generateWhatsAppLink(
                    selectedEvent.client_whatsapp,
                    selectedEvent.client_name,
                    selectedEvent.start,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors text-lg"
                >
                  <FaWhatsapp className="mr-2" />
                  Send WhatsApp Message
                </a>
              )}
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => handleDelete(selectedEvent.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

