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
    // Add more services as needed
  ]
  
  const galleryImages = [
    { src: "/a.jpg", alt: "Bridal Makeup", category: "Bridal" },
    { src: "/b.jpg", alt: "Photoshoot Makeup", category: "Photoshoot" },
    { src: "/c.jpg", alt: "Glam Look Makeup", category: "Glam Look" },
    { src: "/d.jpg", alt: "Editorial Makeup", category: "Editorial" },
    { src: "/e.jpg", alt: "Editorial Makeup", category: "Editorial" },
    { src: "/f.jpg", alt: "Glam Look Makeup", category: "Glam Look" },
    { src: "/g.jpg", alt: "Glam Look Makeup", category: "Glam Look" },
    { src: "/h.jpg", alt: "Editorial Makeup", category: "Editorial" },
    { src: "/m.jpg", alt: "Avant-Garde Makeup", category: "Avant-Garde" },
    { src: "/b.jpg", alt: "Avant-Garde Makeup", category: "Avant-Garde" },
    { src: "/n.jpg", alt: "Glam Look Makeup", category: "Glam Look" },
    { src: "/p.jpg", alt: "Glam Look Makeup", category: "Glam Look" },
    { src: "/q.jpg", alt: "Glam Look Makeup", category: "Glam Look" },
    { src: "/r.jpg", alt: "Glam Look Makeup", category: "Glam Look" },
    { src: "/s.jpg", alt: "Bridal Makeup", category: "Bridal" },
    { src: "/t.jpg", alt: "Glam Look Makeup", category: "Glam Look" },
    { src: "/u.jpg", alt: "Glam Look Makeup", category: "Glam Look" },
    { src: "/v.jpg", alt: "Bridal Makeup", category: "Bridal" },
    { src: "/x.jpg", alt: "Photoshoot Makeup", category: "Photoshoot" },
    { src: "/y.jpg", alt: "Photoshoot Makeup", category: "Photoshoot" },
    { src: "/z.jpg", alt: "Glam Look Makeup", category: "Glam Look" },
  ]
  
  export async function searchContent(query) {
    // Simulate an async operation (e.g., database query)
    await new Promise((resolve) => setTimeout(resolve, 100))
  
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
  
  