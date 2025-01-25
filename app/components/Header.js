"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { FaRegMoneyBillAlt } from "react-icons/fa"
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({ subsets: ["latin"] })

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
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
              <span
                className={`relative z-10 bg-clip-text text-transparent ${isScrolled ? "bg-gradient-to-r from-pink-500 to-purple-600" : "text-white"}`}
              >
                DolapoUdekwe
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></span>
            </span>
          </Link>
          <div className="hidden md:flex space-x-6">
            {["Home", "About", "Why Us", "Services", "Gallery", "Blog", "Contact", "Prices"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase().replace(/ /g, "-")}`}
                className={`relative text-base font-medium ${isScrolled ? "text-gray-800" : "text-white"} hover:text-pink-500 transition-colors duration-300 flex items-center`}
              >
                {item === "Prices" && <FaRegMoneyBillAlt className="mr-1" />}
                <span>{item}</span>
                <motion.span
                  className="absolute left-0 right-0 bottom-0 h-0.5 bg-pink-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </motion.header>
  )
}

