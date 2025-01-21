import "./globals.css"
import { Inter } from "next/font/google"
import Header from "./components/Header"
import Footer from "./components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DolapoUdekwe - Professional Makeup Artistry in Purfleet, Essex",
  description:
    "Transform your look with DolapoUdekwe. Expert makeup services for weddings, special events, and photoshoots in Purfleet, Essex. Book your appointment today!",
  keywords:
    "makeup artist, professional, bridal makeup, special event makeup, photoshoot makeup, Purfleet, Essex, London, United Kingdom",
  openGraph: {
    title: "DolapoUdekwe - Professional Makeup Artistry",
    description: "Expert makeup services in Purfleet, Essex",
    images: [{ url: "https://www.dolapoudekwe.com/og-image.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DolapoUdekwe - Professional Makeup Artistry",
    description: "Expert makeup services in Purfleet, Essex",
    images: ["https://www.dolapoudekwe.com/twitter-image.jpg"],
  },
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

