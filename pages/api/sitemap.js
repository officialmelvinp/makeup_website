import { SitemapStream, streamToPromise } from 'sitemap'

export default async function handler(req, res) {
  try {
    const smStream = new SitemapStream({
      hostname: `https://${req.headers.host}`,
    })

    // List all the pages of your site
    const pages = [
      { url: '/', changefreq: 'daily', priority: 1 },
      { url: '/about', changefreq: 'weekly', priority: 0.8 },
      { url: '/services', changefreq: 'weekly', priority: 0.8 },
      { url: '/gallery', changefreq: 'weekly', priority: 0.8 },
      { url: '/contact', changefreq: 'monthly', priority: 0.6 },
      { url: '/prices', changefreq: 'monthly', priority: 0.6 },
    ]

    // Create each URL row
    pages.forEach((page) => {
      smStream.write(page)
    })

    // End sitemap stream
    smStream.end()

    // XML sitemap string
    const sitemapOutput = (await streamToPromise(smStream)).toString()

    // Set headers
    res.writeHead(200, {
      'Content-Type': 'application/xml',
    })

    // Send response
    res.end(sitemapOutput)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Error generating sitemap' })
  }
}