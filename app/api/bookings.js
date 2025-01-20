import { events } from './events'; // Import the events array

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, service, date, message } = req.body;

    // Check if the slot is available
    const isSlotAvailable = !events.some(event => 
      new Date(event.start).getTime() === new Date(date).getTime()
    );

    if (!isSlotAvailable) {
      return res.status(400).json({ error: 'This slot is already booked' });
    }

    // In a real application, you would save this to a database
    const newBooking = {
      id: events.length + 1,
      start: new Date(date),
      end: new Date(new Date(date).getTime() + 2 * 60 * 60 * 1000), // 2 hours duration
      title: "Booked",
      name,
      email,
      phone,
      service,
      message
    };

    events.push(newBooking);

    res.status(201).json({ message: 'Booking successful', booking: newBooking });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

