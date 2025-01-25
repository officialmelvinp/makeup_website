import Link from "next/link"
import Image from "next/image"

// Temporary blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Coming Soon: Makeup Tips & Trends",
    excerpt: "Stay tuned for exciting makeup content...",
    media: { type: "image", src: "/twitter.jpg", alt: "Coming Soon" },
    date: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Exciting Content on the Way",
    excerpt: "We&apos;re preparing amazing makeup tutorials and tips for you...",
    media: { type: "image", src: "/placeholder.svg", alt: "Coming Soon" },
    date: new Date().toISOString(),
  },
]

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-bold text-center mb-12 text-plum-800 font-playfair">Makeup Tips & Trends</h1>
      <div className="text-center mb-8">
        <p className="text-2xl text-charcoal-600 font-lato">Our blog is coming soon!</p>
        <p className="text-lg text-charcoal-600 font-lato mt-2">
          We&apos;re working on exciting content for you. Check back later for makeup tips, tutorials, and trends.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div className="relative aspect-video">
              <Image
                src={post.media.src || "/placeholder.svg"}
                alt={post.media.alt}
                width={400}
                height={225}
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-plum-700 font-playfair">{post.title}</h2>
              <p className="text-charcoal-600 mb-4 font-lato">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 font-lato">{new Date(post.date).toLocaleDateString()}</span>
                <span className="text-rose-gold font-semibold font-lato">Coming Soon</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

