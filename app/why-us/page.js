import Image from "next/image"
import { FaStar, FaCertificate, FaPalette, FaHeart } from "react-icons/fa"

export default function WhyUs() {
  const reasons = [
    {
      icon: <FaStar className="w-12 h-12 text-rose-gold" />,
      title: "Expert Artistry",
      description:
        "With years of experience and continuous training, our makeup artists bring unparalleled skill and creativity to every look.",
    },
    {
      icon: <FaCertificate className="w-12 h-12 text-rose-gold" />,
      title: "Premium Products",
      description:
        "We use only the highest quality, long-lasting makeup products to ensure your look stays flawless throughout your event.",
    },
    {
      icon: <FaPalette className="w-12 h-12 text-rose-gold" />,
      title: "Personalized Service",
      description:
        "We take the time to understand your unique style and preferences, creating a look that&apos;s perfectly tailored to you.",
    },
    {
      icon: <FaHeart className="w-12 h-12 text-rose-gold" />,
      title: "Passion for Beauty",
      description:
        "Our love for makeup artistry shines through in every application, ensuring you feel confident and beautiful.",
    },
  ]

  return (
    <div className="container mx-auto px-6 py-16 mt-20">
      <h1 className="text-5xl font-bold text-center mb-16 text-plum-800 font-playfair">Why Choose Us</h1>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <Image
            src="/z2.jpg"
            alt="Makeup artist applying makeup"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-plum-700 font-playfair">
            Elevate Your Beauty with DolapoUdekwe
          </h2>
          <p className="text-lg text-charcoal-600 mb-6 font-lato">
            At DolapoUdekwe, we believe that makeup is more than just enhancing your appearance&mdash;it&apos;s about
            boosting your confidence and helping you feel your absolute best. Our team of skilled makeup artists is
            dedicated to creating stunning looks that reflect your unique personality and style.
          </p>
          <p className="text-lg text-charcoal-600 font-lato">
            Whether you&apos;re preparing for your wedding day, a special event, or a professional photoshoot,
            we&apos;re here to ensure you look and feel amazing. Our commitment to excellence, attention to detail, and
            passion for beauty set us apart in the world of makeup artistry.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {reasons.map((reason, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform duration-300 hover:scale-105"
          >
            <div className="flex justify-center mb-4">{reason.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-plum-700 font-playfair">{reason.title}</h3>
            <p className="text-charcoal-600 font-lato">{reason.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-champagne-100 p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 text-plum-800 font-playfair">Our Commitment to You</h3>
        <p className="text-lg text-charcoal-600 mb-4 font-lato">
          When you choose DolapoUdekwe, you&apos;re not just getting a makeup service&mdash;you&apos;re getting a
          partner in your beauty journey. We&apos;re committed to:
        </p>
        <ul className="list-disc list-inside text-charcoal-600 font-lato space-y-2">
          <li>Listening to your needs and preferences</li>
          <li>Providing expert advice and recommendations</li>
          <li>Ensuring a relaxing and enjoyable experience</li>
          <li>Delivering results that exceed your expectations</li>
        </ul>
      </div>
    </div>
  )
}

