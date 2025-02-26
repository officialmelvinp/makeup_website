import Link from "next/link"
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa"
import { Calendar } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-purple-100 text-gray-800">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left md:col-span-3 lg:col-span-1">
            <h2 className="text-2xl font-bold mb-2 text-plum-800 font-playfair">Dolapo Udekwe</h2>
            <p className="text-sm opacity-75 mb-4">Transforming faces, enhancing beauty</p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="https://www.instagram.com/dazzledolls_makeup?igsh=eG9odDRxaXB1NTVs"
                className="text-gray-600 hover:text-pink-500 transition-colors duration-300"
              >
                <FaInstagram size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors duration-300">
                <FaFacebookF size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors duration-300">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
          <nav className="flex flex-col space-y-2 md:pl-20 lg:pl-0">
            <Link href="/" className="hover:text-pink-500 transition-colors duration-300">
              Home
            </Link>
            <Link href="/about" className="hover:text-pink-500 transition-colors duration-300">
              About
            </Link>
            <Link href="/services" className="hover:text-pink-500 transition-colors duration-300">
              Services
            </Link>
            <Link href="/gallery" className="hover:text-pink-500 transition-colors duration-300">
              Gallery
            </Link>
            <Link href="/contact" className="hover:text-pink-500 transition-colors duration-300">
              Contact
            </Link>
            <Link href="/prices" className="hover:text-pink-500 transition-colors duration-300">
              Prices
            </Link>
            <Link href="/booking" className="hover:text-pink-500 transition-colors duration-300 flex items-center">
              <Calendar className="mr-1" size={18} />
              Booking
            </Link>
          </nav>
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p className="text-sm mb-1">Email: contact@dolapoudekwe.co.uk</p>
            <p className="text-sm">Address: London, UK</p>
          </div>
        </div>
        <div className="border-t border-gray-300 mt-8 pt-8 text-sm text-center opacity-75">
          &copy; {new Date().getFullYear()} DolapoUdekwe. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

