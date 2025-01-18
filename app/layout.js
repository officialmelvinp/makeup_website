import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Your Makeup Artist',
  description: 'Professional Makeup Artist Services',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`flex flex-col min-h-screen bg-neutral-50 ${inter.className}`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

