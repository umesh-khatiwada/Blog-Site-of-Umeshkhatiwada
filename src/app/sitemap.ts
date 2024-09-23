import { MetadataRoute } from 'next'
import { BASE_URL } from './types/contants'

// Define the structure of your API response
type BlogPost = {
  id: number
  attributes: {
    slug: string
    publishedAt: string
    img: {
      data: {
        attributes: {
          url: string
        }
      }
    }
  }
}

type BlogApiResponse = {
  data: BlogPost[]
}

// Function to fetch posts from the API
async function fetchPosts(): Promise<BlogApiResponse> {
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
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const imageUrl = post.attributes.img?.data?.attributes?.url
    return {
      url: `${baseUrl}/article/${post.id}/${post.attributes.slug}`,
      lastModified: new Date(post.attributes.publishedAt),
      changeFrequency: 'daily',
      priority: 0.7,
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            title: post.attributes.slug,
            caption: post.attributes.slug,
          },
        ],
      }),
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
      url: `${baseUrl}/article`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // Combine static and dynamic entries
  return [...staticEntries, ...postEntries]
}