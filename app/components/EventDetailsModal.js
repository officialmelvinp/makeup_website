import { Dialog } from "@headlessui/react"
import { X, Phone, Trash2 } from "lucide-react"
import { formatInTimeZone } from "date-fns-tz"

export default function EventDetailsModal({ event, isOpen, onClose, onDelete }) {
  const openWhatsApp = () => {
    const whatsappUrl = `https://wa.me/${event.client_whatsapp.replace(/\D/g, "")}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded bg-white p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-medium">Event Details</Dialog.Title>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>
          <div className="mb-4">
            <p>
              <strong>Client:</strong> {event.client_name}
            </p>
            <p>
              <strong>Service:</strong> {event.service_type}
            </p>
            <p>
              <strong>Date and Time:</strong>{" "}
              {formatInTimeZone(new Date(event.start), event.timezone || "UTC", "yyyy-MM-dd HH:mm")}
            </p>
            <p>
              <strong>Email:</strong> {event.client_email}
            </p>
            <p>
              <strong>Phone:</strong> {event.client_phone}
            </p>
            <p>
              <strong>WhatsApp:</strong> {event.client_whatsapp || "Not provided"}
            </p>
            <p>
              <strong>Notes:</strong> {event.notes || "No notes provided"}
            </p>
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={openWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <Phone className="mr-2" size={18} />
              Chat on WhatsApp
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            >
              <Trash2 className="mr-2" size={18} />
              Delete Event
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}

