import Link from 'next/link'
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">DolapoUdekwe</h2>
            <p className="text-sm opacity-75">Transforming faces, enhancing beauty</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end space-x-4 mb-4 md:mb-0">
            <Link href="/" className="hover:text-pink-200 transition-colors duration-300">Home</Link>
            <Link href="/about" className="hover:text-pink-200 transition-colors duration-300">About</Link>
            <Link href="/services" className="hover:text-pink-200 transition-colors duration-300">Services</Link>
            <Link href="/gallery" className="hover:text-pink-200 transition-colors duration-300">Gallery</Link>
            <Link href="/contact" className="hover:text-pink-200 transition-colors duration-300">Contact</Link>
            <Link href="/prices" className="hover:text-pink-200 transition-colors duration-300">Prices</Link>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-white hover:text-pink-200 transition-colors duration-300">
              <FaInstagram size={24} />
            </a>
            <a href="#" className="text-white hover:text-pink-200 transition-colors duration-300">
              <FaFacebookF size={24} />
            </a>
            <a href="#" className="text-white hover:text-pink-200 transition-colors duration-300">
              <FaTwitter size={24} />
            </a>
          </div>
        </div>
        <div className="border-t border-pink-400 mt-8 pt-8 text-sm text-center opacity-75">
          &copy; {new Date().getFullYear()} DolapoUdekwe. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

