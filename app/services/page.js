import Image from 'next/image'

const services = [
  {
    title: "Bridal Makeup",
    description: "Look your absolute best on your special day with our professional bridal makeup services.",
    image: "/placeholder.svg"
  },
  {
    title: "Special Event Makeup",
    description: "Get ready for any special occasion with our expert makeup application.",
    image: "/placeholder.svg"
  },
  {
    title: "Photoshoot Makeup",
    description: "Camera-ready makeup that will make you look stunning in every shot.",
    image: "/placeholder.svg"
  },
  {
    title: "Makeup Lessons",
    description: "Learn professional techniques to enhance your everyday makeup routine.",
    image: "/placeholder.svg"
  }
]

export default function Services() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <Image
              src={service.image}
              alt={service.title}
              width={600}
              height={400}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">{service.title}</h2>
              <p className="text-gray-600">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}