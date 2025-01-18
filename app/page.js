import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <section className="relative h-screen">
        <Image
          src="/logo.jpg"
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">DazzleDolls</h1>
            <p className="text-2xl mb-8">Professional Makeup Artist</p>
            <Link href="/contact" className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition duration-300">
              Book Now
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Bridal Makeup', 'Special Event Makeup', 'Photoshoot Makeup'].map((service, index) => (
              <div key={index} className="bg-gray-100 p-6 rounded-lg text-center">
                <h3 className="text-xl font-semibold mb-4">{service}</h3>
                <p className="mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <Link href="/services" className="text-pink-500 hover:underline">Learn More</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Recent Work</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src="/placeholder.svg"
                  alt={`Gallery Image ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/gallery" className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition duration-300">
              View Gallery
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}