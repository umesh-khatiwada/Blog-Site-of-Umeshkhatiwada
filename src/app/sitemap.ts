import { MetadataRoute } from 'next'
import { BASE_URL } from './types/contants'
import { Article } from './types/blog'

async function fetchPosts(): Promise<Article> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}blogs?fields[0]=slug&fields[1]=publishedAt&populate[img][fields][0]=url`
  )
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }
  return response.json()
}

// Main sitemap generation function
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const apiResponse = await fetchPosts()
  const posts = apiResponse.data

  const baseUrl = BASE_URL || 'http://localhost:3000'

  // Generate entries for blog posts
  const postEntries: MetadataRoute.Sitemap = posts.map((post: Article) => {
    const lastModified = post.publishedAt ? new Date(post.publishedAt) : new Date();
  
    return {
      url: `${baseUrl}/article/${post.attributes.slug}`,
      lastModified: lastModified.toISOString(),
      changeFrequency: 'daily',
      priority: 0.7,
    }
  })
  

  // Static entries for main pages
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/article/[slug]`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // Combine static and dynamic entries
  return [...staticEntries, ...postEntries]
}