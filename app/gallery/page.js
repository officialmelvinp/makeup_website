'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function Gallery() {
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [filterCategory, setFilterCategory] = useState('All')

  const images = [
    { src: "/a.jpg", alt: "Bridal Makeup", category: "Bridal" },
    { src: "/b.jpg", alt: "Glamour Makeup", category: "Glamour" },
    { src: "/c.jpg", alt: "Natural Makeup", category: "Natural" },
    { src: "/d.jpg", alt: "Editorial Makeup", category: "Editorial" },
    { src: "/e.jpg", alt: "Special Effects Makeup", category: "Special Effects" },
    { src: "/f.jpg", alt: "Avant-Garde Makeup", category: "Avant-Garde" },
    { src: "/g.jpg", alt: "Vintage Makeup", category: "Vintage" },
    { src: "/h.jpg", alt: "Red Carpet Makeup", category: "Red Carpet" },
    { src: "/s.jpg", alt: "Photoshoot Makeup", category: "Photoshoot" },
    { src: "/m.jpg", alt: "Runway Makeup", category: "Runway" },
    { src: "/n.jpg", alt: "Theatrical Makeup", category: "Theatrical" },
    { src: "/p.jpg", alt: "Everyday Makeup", category: "Everyday" },
    { src: "/q.jpg", alt: "Everyday Makeup", category: "Everyday" },
    { src: "/r.jpg", alt: "Everyday Makeup", category: "Everyday" },
    { src: "/s.jpg", alt: "Everyday Makeup", category: "Everyday" },
    { src: "/t.jpg", alt: "Everyday Makeup", category: "Everyday" },
    { src: "/u.jpg", alt: "Everyday Makeup", category: "Everyday" },
    { src: "/v.jpg", alt: "Everyday Makeup", category: "Everyday" },
    { src: "/x.jpg", alt: "Everyday Makeup", category: "Everyday" },
    { src: "/y.jpg", alt: "Everyday Makeup", category: "Everyday" },
    { src: "/z.jpg", alt: "Everyday Makeup", category: "Everyday" },
  ]

  const categories = ['All', ...new Set(images.map(img => img.category))]

  const filteredImages = filterCategory === 'All' 
    ? images 
    : images.filter(img => img.category === filterCategory)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return
      if (e.key === 'ArrowLeft') navigateImage(-1)
      if (e.key === 'ArrowRight') navigateImage(1)
      if (e.key === 'Escape') setSelectedImage(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage])

  const navigateImage = (direction) => {
    const newIndex = (currentImageIndex + direction + filteredImages.length) % filteredImages.length
    setSelectedImage(filteredImages[newIndex])
    setCurrentImageIndex(newIndex)
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        Our Stunning Gallery
      </h1>
      
      <div className="flex justify-center space-x-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilterCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors duration-300 ${
              filterCategory === category
                ? 'bg-pink-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-pink-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        layout
      >
        <AnimatePresence>
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.src + index}
              layoutId={image.src + index}
              className="relative aspect-square group cursor-pointer overflow-hidden rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => {
                setSelectedImage(image)
                setCurrentImageIndex(index)
              }}
            >
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-lg transition-transform duration-300 group-hover:scale-110"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex items-end justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-white text-lg font-semibold text-center">{image.alt}</p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] w-full h-full"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <Image
                src={selectedImage.src || "/placeholder.svg"}
                alt={selectedImage.alt}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <button
                className="absolute top-4 right-4 text-white text-4xl"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(null)
                }}
              >
                <FiX />
              </button>
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage(-1)
                }}
              >
                <FiChevronLeft />
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage(1)
                }}
              >
                <FiChevronRight />
              </button>
            </motion.div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg">
              {selectedImage.alt}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

