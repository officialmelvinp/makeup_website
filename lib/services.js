const services = [
  {
    id: "bridal-makeup",
    title: "Bridal Makeup",
    description: "Make your special day unforgettable with our expert bridal makeup services.",
  },
  {
    id: "special-event-makeup",
    title: "Special Event Makeup",
    description: "Look stunning for any occasion with our tailored special event makeup.",
  },
  {
    id: "photoshoot-makeup",
    title: "Photoshoot Makeup",
    description: "Camera-ready looks that capture your best self for any photoshoot.",
  },
]

const galleryImages = [
  { src: "/a.jpg", alt: "Bridal Makeup", category: "Bridal" },
  { src: "/b.jpg", alt: "Photoshoot Makeup", category: "Photoshoot" },
  { src: "/c.jpg", alt: "Glam Look Makeup", category: "Glam Look" },
  // Add more images as needed
]

export async function searchContent(query) {
  const lowercaseQuery = query.toLowerCase()

  const matchedServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(lowercaseQuery) ||
      service.description.toLowerCase().includes(lowercaseQuery),
  )

  const matchedImages = galleryImages.filter(
    (image) =>
      image.alt.toLowerCase().includes(lowercaseQuery) || image.category.toLowerCase().includes(lowercaseQuery),
  )

  return {
    services: matchedServices,
    images: matchedImages,
  }
}

