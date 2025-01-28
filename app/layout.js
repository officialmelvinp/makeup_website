import "./globals.css"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Inter } from "next/font/google"
import Header from "./components/Header"
import Footer from "./components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  metadataBase: new URL("https://www.dolapoudekwe.co.uk"),
  title: "DolapoUdekwe - Professional Makeup Artistry in Purfleet, Essex",
  description:
    "Transform your look with DolapoUdekwe. Expert makeup services for weddings, special events, and photoshoots in Purfleet, Essex. Book your appointment today!",
  keywords: [
    "makeup artist",
    "professional",
    "bridal makeup",
    "special event makeup",
    "photoshoot makeup",
    "Purfleet",
    "Essex",
    "London",
    "United Kingdom",
  ],
  openGraph: {
    type: "website",
    title: "DolapoUdekwe - Professional Makeup Artistry",
    description: "Expert makeup services in Purfleet, Essex",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DolapoUdekwe - Professional Makeup Artistry",
    description: "Expert makeup services in Purfleet, Essex",
    images: [{ url: "/twitter.jpg" }],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  )
}