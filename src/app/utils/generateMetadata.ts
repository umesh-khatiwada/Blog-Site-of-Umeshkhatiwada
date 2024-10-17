// app/utils/generateMetadata.ts
import { Metadata } from 'next'
import { fetchBlogDetailData } from '@/app/lib/api'

export async function generateMetadata({ params }: { params: { id: string, slug: string } }): Promise<Metadata> {
  const id = params.id
  const postData = await fetchBlogDetailData(id)
  
  if (!postData || !postData.data) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  const { Title, shortDescription, img } = postData.data
  const canonicalUrl = `https://blog.umeshkhatiwada.com.np/article/${Title}`
  return {
    title: Title,
    description: shortDescription,
    openGraph: {
      title: Title,
      description: shortDescription,
      images: img?.[0]?.url ? [img?.[0].url] : [],
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: Title,
      description: shortDescription,
      images: img?.[0]?.url ? [img?.[0].url] : [],
    },
    alternates: {
      canonical: canonicalUrl, 
    },
  }
}
