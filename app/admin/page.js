"use client"

import { useState, useEffect } from "react"
import { parseISO, format, addHours } from "date-fns"
import { formatInTimeZone, utcToZonedTime } from "date-fns-tz"
import AdminLoginForm from "@/app/components/AdminLoginForm"
import EventListView from "@/app/components/EventListView"
import EventDetailsModal from "@/app/components/EventDetailsModal"
import ChangePasswordModal from "@/app/components/AdminChangePasswordModal"
import { LogOut, Key } from "lucide-react"
import { supabase, getContactMessages } from "@/lib/supabase"

export default function AdminPage() {
  const [events, setEvents] = useState([])
  const [messages, setMessages] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("events")

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session) {
      const { data: adminUser, error } = await supabase
        .from("admin_users")
        .select("*")
        .eq("email", session.user.email)
        .single()

      if (adminUser && !error) {
        setIsAuthenticated(true)
        fetchEvents()
        fetchMessages()
      } else {
        await supabase.auth.signOut()
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase.from("events").select("*").order("start", { ascending: true })

      if (error) throw error

      setEvents(
        data.map((event) => {
          const eventStart = parseISO(event.start)
          const zonedEventStart = utcToZonedTime(eventStart, event.timezone || "UTC")
          return {
            ...event,
            start: zonedEventStart,
            title: `${event.service_type} - ${event.client_name}`,
          }
        }),
      )
    } catch (error) {
      console.error("Error fetching events:", error)
    }
  }

  const fetchMessages = async () => {
    try {
      const messages = await getContactMessages()
      setMessages(messages)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setEvents([])
    setMessages([])
  }

  const handleChangePassword = () => {
    setIsChangePasswordModalOpen(true)
  }

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const { error } = await supabase.from("events").delete().eq("id", eventId)

        if (error) throw error

        setEvents(events.filter((event) => event.id !== eventId))
        setIsModalOpen(false)
      } catch (error) {
        console.error("Error deleting event:", error)
        alert("Failed to delete event. Please try again.")
      }
    }
  }

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const { error } = await supabase.from("contact_messages").delete().eq("id", messageId)

        if (error) throw error

        setMessages(messages.filter((message) => message.id !== messageId))
      } catch (error) {
        console.error("Error deleting message:", error)
        alert("Failed to delete message. Please try again.")
      }
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return (
      <AdminLoginForm
        onLoginSuccess={() => {
          setIsAuthenticated(true)
          fetchEvents()
          fetchMessages()
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

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("events")}
              className={`${
                activeTab === "events"
                  ? "border-plum-500 text-plum-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`${
                activeTab === "messages"
                  ? "border-plum-500 text-plum-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm`}
            >
              Messages
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "events" && (
        <>
          <EventListView
            events={events}
            onSelectEvent={handleSelectEvent}
            onDeleteEvent={handleDeleteEvent}
            formatEventTime={(event) => formatInTimeZone(event.start, event.timezone || "UTC", "HH:mm")}
          />
          <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden mt-8 p-4">
            <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-100 p-4 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSelectEvent(event)}
                >
                  <h3 className="font-bold">{event.title}</h3>
                  <p>{formatInTimeZone(event.start, event.timezone, "MMMM d, yyyy")}</p>
                  <p>{formatInTimeZone(event.start, event.timezone, "HH:mm")}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === "messages" && (
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden mt-8 p-4">
          <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{message.name}</h3>
                    <p className="text-sm text-gray-600">{message.email}</p>
                  </div>
                  <button onClick={() => handleDeleteMessage(message.id)} className="text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">{new Date(message.created_at).toLocaleString()}</p>
                <p className="mt-2">{message.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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

