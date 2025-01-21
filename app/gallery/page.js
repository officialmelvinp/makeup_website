"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { FiX, FiChevronLeft, FiChevronRight, FiShare2 } from "react-icons/fi"
import Masonry from "react-masonry-css"
import InfiniteScroll from "react-infinite-scroll-component"
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider"

function GalleryContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("q")

  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [filterCategory, setFilterCategory] = useState("All")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const images = [
    { src: "/a.jpg", alt: "Bridal Makeup", category: "Bridal", tags: ["wedding", "elegant"] },
    { src: "/b.jpg", alt: "Photoshoot Makeup", category: "Photoshoot", tags: ["glamour", "studio"] },
    { src: "/c.jpg", alt: "Glam Look Makeup", category: "Glam Look", tags: ["evening", "party"] },
    { src: "/d.jpg", alt: "Editorial Makeup", category: "Editorial", tags: ["fashion", "avant-garde"] },
    { src: "/e.jpg", alt: "Editorial Makeup", category: "Editorial", tags: ["high-fashion", "creative"] },
    { src: "/f.jpg", alt: "Glam Look Makeup", category: "Glam Look", tags: ["red-carpet", "celebrity"] },
    { src: "/g.jpg", alt: "Glam Look Makeup", category: "Glam Look", tags: ["night-out", "bold"] },
    { src: "/h.jpg", alt: "Editorial Makeup", category: "Editorial", tags: ["magazine", "artistic"] },
    { src: "/m.jpg", alt: "Avant-Garde Makeup", category: "Avant-Garde", tags: ["experimental", "runway"] },
    { src: "/b.jpg", alt: "Avant-Garde Makeup", category: "Avant-Garde", tags: ["theatrical", "costume"] },
    { src: "/n.jpg", alt: "Glam Look Makeup", category: "Glam Look", tags: ["smokey-eye", "contour"] },
    { src: "/p.jpg", alt: "Glam Look Makeup", category: "Glam Look", tags: ["natural-glam", "everyday"] },
    { src: "/q.jpg", alt: "Glam Look Makeup", category: "Glam Look", tags: ["bronze", "summer"] },
    { src: "/r.jpg", alt: "Glam Look Makeup", category: "Glam Look", tags: ["dramatic", "evening"] },
    { src: "/s.jpg", alt: "Bridal Makeup", category: "Bridal", tags: ["classic", "timeless"] },
    { src: "/t.jpg", alt: "Glam Look Makeup", category: "Glam Look", tags: ["red-lip", "vintage"] },
    { src: "/u.jpg", alt: "Glam Look Makeup", category: "Glam Look", tags: ["soft-glam", "romantic"] },
    { src: "/v.jpg", alt: "Bridal Makeup", category: "Bridal", tags: ["bohemian", "natural"] },
    { src: "/x.jpg", alt: "Photoshoot Makeup", category: "Photoshoot", tags: ["commercial", "fresh"] },
    { src: "/y.jpg", alt: "Photoshoot Makeup", category: "Photoshoot", tags: ["beauty", "close-up"] },
    { src: "/z.jpg", alt: "Glam Look Makeup", category: "Glam Look", tags: ["festive", "holiday"] },
  ]

  const categories = ["All", ...new Set(images.map((img) => img.category))]
  const tags = [...new Set(images.flatMap((img) => img.tags))]

  const [selectedTags, setSelectedTags] = useState([])

  const filteredImages = images.filter(
    (img) =>
      (filterCategory === "All" || img.category === filterCategory) &&
      (selectedTags.length === 0 || selectedTags.every((tag) => img.tags.includes(tag))) &&
      (!searchQuery ||
        img.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))),
  )

  const [displayedImages, setDisplayedImages] = useState(filteredImages.slice(0, 8))

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return
      if (e.key === "ArrowLeft") navigateImage(-1)
      if (e.key === "ArrowRight") navigateImage(1)
      if (e.key === "Escape") setSelectedImage(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImage])

  const navigateImage = (direction) => {
    const newIndex = (currentImageIndex + direction + filteredImages.length) % filteredImages.length
    setSelectedImage(filteredImages[newIndex])
    setCurrentImageIndex(newIndex)
  }

  const loadMore = () => {
    const newPage = page + 1
    const newImages = filteredImages.slice(0, newPage * 8)
    setDisplayedImages(newImages)
    setPage(newPage)
    setHasMore(newImages.length < filteredImages.length)
  }

  const handleTagClick = (tag) => {
    setSelectedTags((prevTags) => (prevTags.includes(tag) ? prevTags.filter((t) => t !== tag) : [...prevTags, tag]))
  }

  const shareImage = (image) => {
    if (navigator.share) {
      navigator
        .share({
          title: image.alt,
          text: `Check out this amazing ${image.category} makeup!`,
          url: window.location.origin + image.src,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error))
    } else {
      alert("Web Share API is not supported in your browser")
    }
  }

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        Our Stunning Gallery
      </h1>

      <div className="flex flex-wrap justify-center space-x-2 space-y-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilterCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors duration-300 ${
              filterCategory === category ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-pink-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center space-x-2 space-y-2 mb-8">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full text-sm transition-colors duration-300 ${
              selectedTags.includes(tag) ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-purple-200"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      <InfiniteScroll
        dataLength={displayedImages.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <Masonry breakpointCols={breakpointColumnsObj} className="flex w-auto" columnClassName="bg-clip-padding px-2">
          {displayedImages.map((image, index) => (
            <motion.div
              key={image.src + index}
              layoutId={image.src + index}
              className="relative mb-4 cursor-pointer overflow-hidden rounded-lg shadow-lg"
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
                width={300}
                height={300}
                layout="responsive"
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
        </Masonry>
      </InfiniteScroll>

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
              {selectedImage.beforeAfter ? (
                <ReactCompareSlider
                  itemOne={<ReactCompareSliderImage src={selectedImage.src} alt={selectedImage.alt} />}
                  itemTwo={
                    <ReactCompareSliderImage src={selectedImage.beforeAfter} alt={`Before ${selectedImage.alt}`} />
                  }
                />
              ) : (
                <Image
                  src={selectedImage.src || "/placeholder.svg"}
                  alt={selectedImage.alt}
                  width={500}
                  height={500}
                  layout="responsive"
                />
              )}
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
              <button
                className="absolute bottom-4 right-4 text-white text-2xl"
                onClick={(e) => {
                  e.stopPropagation()
                  shareImage(selectedImage)
                }}
              >
                <FiShare2 />
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

export default function Gallery() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GalleryContent />
    </Suspense>
  )
}

