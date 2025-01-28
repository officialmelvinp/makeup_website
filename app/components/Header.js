"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Playfair_Display } from "next/font/google"
import { Calendar, Menu, X } from "lucide-react"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    setIsScrolled(false) // Set to false initially
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Why Us", path: "/why-us" },
    { name: "Services", path: "/services" },
    { name: "Gallery", path: "/gallery" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
    { name: "Prices", path: "/prices" },
    { name: "Booking", path: "/booking", icon: Calendar },
  ]

  return (
    <motion.header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-white bg-opacity-90"
      }`}
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src="/logo.jpeg" alt="DolapoUdekwe Logo" width={100} height={40} style={{ objectFit: "contain" }} />
            <span className={`${playfair.className} text-2xl font-extrabold ml-2 relative overflow-hidden group`}>
              <span className={`relative z-10 text-plum-800`}>DolapoUdekwe</span>
              <span className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></span>
            </span>
          </Link>
          <div className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`relative text-base font-medium ${
                  isScrolled ? "text-gray-800" : "text-gray-800"
                } hover:text-pink-500 transition-colors duration-300 flex items-center`}
              >
                {item.icon && <item.icon className="mr-1" size={18} />}
                <span>{item.name}</span>
                <motion.span
                  className="absolute left-0 right-0 bottom-0 h-0.5 bg-pink-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </div>
          <button
            className="md:hidden text-gray-800 hover:text-pink-500 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="container mx-auto px-4 py-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="block py-2 text-gray-800 hover:text-pink-500 transition-colors duration-300 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <item.icon className="mr-2" size={18} />}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

