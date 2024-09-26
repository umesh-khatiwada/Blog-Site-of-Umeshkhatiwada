import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleClient from './ArticleClient'
import { fetchBlogDetailData } from "@/app/lib/api"
import { Article } from "@/app/types/blog"

interface PageProps {
  params: { id: string; slug: string }
}

async function getArticle(id: string): Promise<Article> {
  try {
    const article = await fetchBlogDetailData(id)
    return article
  } catch (error) {
    notFound()
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticle(params.id)
  
  return {
    title: article.data.Title,
    description: article.data.description,
    openGraph: {
      title: article.data.Title,
      description: article.data.description,
      images: article.data.img[0]?.url ? [article.data.img[0].url] : [],
    },
  }
}

export default async function Page({ params }: PageProps) {
  const article = await getArticle(params.id)
  
  return <ArticleClient initialData={article} />
}