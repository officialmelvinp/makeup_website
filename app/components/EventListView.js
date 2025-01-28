import { useState } from "react"
import { Calendar, Clock, User, Trash2 } from "lucide-react"
import { formatInTimeZone } from "date-fns-tz"

export default function EventListView({ events, onSelectEvent, onDeleteEvent, formatEventTime }) {
  const [selectedEvent, setSelectedEvent] = useState(null)

  const handleViewDetails = (event) => {
    setSelectedEvent(event)
    onSelectEvent(event)
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                    <span>{formatInTimeZone(new Date(event.start), event.timezone || "UTC", "yyyy-MM-dd")}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                    <span>{formatInTimeZone(new Date(event.start), event.timezone || "UTC", "HH:mm")}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="flex-shrink-0 mr-2 h-5 w-5 text-gray-400" />
                    <span>{event.client_name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {event.service_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(event)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    View Details
                  </button>
                  <button onClick={() => onDeleteEvent(event.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

