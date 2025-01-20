import "./globals.css"
import { Inter } from "next/font/google"
import Header from "./components/Header"
import Footer from "./components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DazzleDolls - Professional Makeup Artistry in London",
  description:
    "Transform your look with DazzleDolls. Expert makeup services for weddings, special events, and photoshoots in [Your City]. Book your appointment today!",
  keywords: "makeup artist, bridal makeup, special event makeup, photoshoot makeup, London",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

