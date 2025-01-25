import Link from "next/link"
import Image from "next/image"

export default function BlogPost({ params }) {
  return (
    <div className="container mx-auto px-4 py-16">
      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-plum-800 font-playfair">Coming Soon</h1>
        <div className="mb-8">
          <Image src="/placeholder.svg" alt="Coming Soon" width={800} height={450} className="rounded-lg" />
        </div>
        <div className="prose prose-lg max-w-none font-lato">
          <p>We&apos;re working hard to bring you amazing makeup content. This blog post will be available soon!</p>
          <p>In the meantime, why not check out our services or gallery?</p>
          <div className="mt-8">
            <Link
              href="/services"
              className="bg-rose-gold text-white px-6 py-3 rounded-full hover:bg-rose-gold-600 transition duration-300 mr-4"
            >
              Our Services
            </Link>
            <Link
              href="/gallery"
              className="bg-plum-700 text-white px-6 py-3 rounded-full hover:bg-plum-800 transition duration-300"
            >
              View Gallery
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}

