// Thisis a simple in-memory store. In a real application, you'd use a database.
let events = [ 
    {
      id: 1,
      start: new Date(2025, 0, 20, 10, 0), // January 20, 2025, 10:00 AM
      end: new Date(2025, 0, 20, 12, 0),   // January 20, 2025, 12:00 PM
      title: "Booked"
    },
    {
      id: 2,
      start: new Date(2025, 0, 22, 14, 0), // January 22, 2025, 2:00 PM
      end: new Date(2025, 0, 22, 16, 0),   // January 22, 2025, 4:00 PM
      title: "Booked"
    }
  ];
  
  export default function handler(req, res) {
    if (req.method === 'GET') {
      // Return all events
      res.status(200).json(events);
    } else if (req.method === 'POST') {
      // Add a new event
      const newEvent = {
        id: events.length + 1,
        ...req.body,
        title: "Booked"
      };
      events.push(newEvent);
      res.status(201).json(newEvent);
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  
  