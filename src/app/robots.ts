import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: [],  // Use an empty array to allow all pages
    },
    sitemap: 'https://blog.umeshkhatiwada.com.np/sitemap.xml',
  }
}
