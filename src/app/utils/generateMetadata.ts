// app/utils/generateMetadata.ts
import { Metadata } from 'next'
import { fetchBlogDetailData } from '@/app/lib/api'

export async function generateMetadata({ params }: { params: { id: string, slug: string } }): Promise<Metadata> {
  const id = params.id
  const postData = await fetchBlogDetailData(id)

  console.log("postData", postData)
  if (!postData || !postData.data || !postData.data.attributes) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  const { Title, description, img } = postData.data.attributes

  return {
    title: Title,
    description: description.slice(0, 160), // Truncate to a reasonable length for meta description
    openGraph: {
      title: Title,
      description: description.slice(0, 160),
      images: img?.data?.attributes?.url ? [img.data.attributes.url] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: Title,
      description: description.slice(0, 160),
      images: img?.data?.attributes?.url ? [img.data.attributes.url] : [],
    },
  }
}