import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleClient from './ArticleClient'
import { fetchBlogDetailData } from "@/app/lib/api"
import { Article } from "@/app/types/blog"


interface PageProps {
  params: { slug: string }
}

async function getArticle(slug: string): Promise<Article | null> {
  try {
    const article = await fetchBlogDetailData(slug)
    return article
  } catch (error) {
    console.error('Error fetching article:', error)
    notFound()
    return null // to avoid potential type issues
  }
}



export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticle(params.slug)
  // console.log("article",article)

  if (!article || !article.data || !article.data[0]) {
    return { title: 'Article not found', description: '' }
  }

  const articleData = article.data[0]

  return {
    title: articleData.Title || 'Untitled',
    description: articleData.shortDescription || 'No description available',
    alternates: { 
      canonical: 'blog.umeshkhatiwada.com.np/article/Key-features-of-ChatGPT/' 
    },
    openGraph: {
      title: articleData.Title || 'Untitled',
      description: articleData.shortDescription || 'No description available',
      images: articleData.img?.[0]?.url || '/default-image.jpg',
    },
  }
}

export default async function Page({ params }: PageProps) {
  const article = await getArticle(params.slug)

  if (!article || !article.data || !article.data[0]) {
    return <p>Article not found</p>
  }

  return <ArticleClient initialData={article} />
}