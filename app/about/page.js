import Image from 'next/image'

export default function About() {
  return (
    <div className="container mx-auto px-6 py-24 bg-gradient-to-br from-champagne-50 via-champagne-100 to-champagne-50">
      <h1 className="text-5xl font-bold text-center mb-16 text-plum-800 font-playfair">About Me</h1>
      <div className="flex flex-col md:flex-row items-center gap-16">
        <div className="md:w-1/2">
          <div className="relative">
            <Image
              src="/z.jpg"
              alt="Dolly Olusoga"
              width={500}
              height={500}
              className="rounded-lg shadow-2xl"
            />
            <div className="absolute inset-0 border-4 border-rose-gold rounded-lg transform translate-x-4 translate-y-4 -z-10"></div>
          </div>
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold mb-8 text-plum-800 font-playfair">Dolly Udekwe</h2>
          <div className="space-y-6 text-lg text-charcoal-700 leading-relaxed">
            <p>
              Welcome to my world of beauty and artistry. I&apos;m Dolly Olusoga, a passionate and professional makeup artist with over a decade of experience in the beauty industry. My journey began in 2013, fueled by a deep love for creativity and a desire to help individuals feel confident in their own skin.
            </p>
            <p>
              Throughout my career, I&apos;ve had the privilege of working with a diverse clientele, from radiant brides seeking a timeless look for their special day to individuals desiring the perfect glam for high-profile events and photoshoots. My philosophy is simple yet powerful: enhance natural beauty while tailoring each makeup look to suit your unique features and personal style.
            </p>
            <p>
              At the heart of my work lies an unwavering commitment to excellence. I consistently use only the highest quality products, stay abreast of the latest industry trends, and provide a personalized, luxurious experience for each and every client. Whether it&apos;s your wedding day, a milestone celebration, or simply a moment where you want to shine, I&apos;m here to bring your vision to life with artistry and meticulous care.
            </p>
            <p className="font-semibold italic text-rose-gold-600">
              Let&apos;s collaborate to create something truly beautiful and unforgettable.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}