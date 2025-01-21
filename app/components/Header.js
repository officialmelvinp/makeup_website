"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"
import { FaRegMoneyBillAlt } from "react-icons/fa"

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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src="/logo.jpeg" alt="DolapoUdekwe Logo" width={150} height={50} style={{ objectFit: "contain" }} />
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 ml-4">
              DolapoUdekwe
            </span>
          </Link>
          <div className="hidden md:flex space-x-6">
            {["Home", "About", "Why Us", "Services", "Gallery", "Blog", "Contact", "Prices"].map((item) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase().replace(/ /g, "-")}`}
                className="relative text-lg font-medium text-gray-800 hover:text-pink-500 transition-colors duration-300 flex items-center"
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

