"use client"

import { useState, useEffect } from "react"
import { Calendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { parseISO, format } from "date-fns"
import AdminLoginForm from "@/app/components/AdminLoginForm"
import EventListView from "@/app/components/EventListView"
import EventDetailsModal from "@/app/components/EventDetailsModal"
import ChangePasswordModal from "@/app/components/AdminChangePasswordModal"
import { LogOut, Key, Trash2 } from "lucide-react"

const localizer = momentLocalizer(moment)

export default function AdminPage() {
  const [events, setEvents] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      try {
        const response = await fetch("/api/auth", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.ok) {
          setIsAuthenticated(true)
          fetchEvents()
        } else {
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }
      const data = await response.json()
      setEvents(
        data.map((event) => {
          const eventStart = parseISO(event.start)
          const eventEnd = moment(eventStart).add(2, "hours").toDate()
          return {
            ...event,
            start: eventStart,
            end: eventEnd,
            title: `${event.service_type} - ${event.client_name}`,
          }
        }),
      )
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    setIsAuthenticated(false)
    setEvents([])
  }

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true)
  }

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        })
        if (response.ok) {
          setEvents(events.filter((event) => event.id !== eventId))
          setIsModalOpen(false)
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete event")
        }
      } catch (error) {
        console.error("Error deleting event:", error)
        alert("Failed to delete event. Please try again.")
      }
    }
  }

  if (!isAuthenticated) {
    return (
      <AdminLoginForm
        onLoginSuccess={() => {
          setIsAuthenticated(true)
          fetchEvents()
        }}
      />
    )
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold text-plum-800 font-playfair">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button
            onClick={handleChangePassword}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            <Key className="mr-2" size={18} />
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            <LogOut className="mr-2" size={18} />
            Logout
          </button>
        </div>
      </div>
      <EventListView
        events={events}
        onSelectEvent={handleSelectEvent}
        onDeleteEvent={handleDeleteEvent}
        formatEventTime={(event) => format(event.start, "HH:mm")}
      />
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden mt-8">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          className="p-4"
          onSelectEvent={handleSelectEvent}
          formats={{
            eventTimeRangeFormat: ({ start, end }, culture, localizer) => {
              return `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`
            },
          }}
        />
      </div>
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={() => handleDeleteEvent(selectedEvent.id)}
        />
      )}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onChangePassword={() => {
          setIsChangePasswordModalOpen(false)
        }}
      />
    </div>
  )
}

